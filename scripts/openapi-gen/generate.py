#!/usr/bin/env python3
"""
OpenAPI Generator for Cosmos Blockchain Documentation

This script analyzes Cosmos chain repositories and generates OpenAPI specifications
for gRPC-Gateway endpoints and EVM JSON-RPC methods.
"""

import os
import sys
import json
import yaml
import argparse
import subprocess
from typing import Dict, List, Any, Optional
from pathlib import Path
import re
import tempfile
import shutil
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class SourceRepo:
    """Configuration for a source repository"""
    repo: str
    branch: str
    paths: List[str]
    output: str
    type: str

class OpenAPIGenerator:
    """Main OpenAPI generator class"""

    def __init__(self, config_path: str):
        """Initialize with configuration file"""
        self.config = self._load_config(config_path)
        self.temp_dir = None

    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load YAML configuration file"""
        try:
            with open(config_path, 'r') as f:
                return yaml.safe_load(f)
        except Exception as e:
            logger.error(f"Failed to load config: {e}")
            raise

    def generate_all(self) -> None:
        """Generate OpenAPI specs for all configured sources"""
        logger.info("Starting OpenAPI generation for all sources")

        for source_name, source_config in self.config['sources'].items():
            logger.info(f"Processing source: {source_name}")
            source = SourceRepo(**source_config)

            try:
                if source.type == "evm-jsonrpc":
                    self._generate_evm_jsonrpc(source_name, source)
                elif source.type == "grpc-gateway":
                    self._generate_grpc_gateway(source_name, source)
                else:
                    logger.warning(f"Unknown source type: {source.type}")

            except Exception as e:
                logger.error(f"Failed to process {source_name}: {e}")
                continue

        logger.info("OpenAPI generation completed")

    def _generate_evm_jsonrpc(self, name: str, source: SourceRepo) -> None:
        """Generate OpenAPI spec for EVM JSON-RPC methods"""
        logger.info(f"Generating EVM JSON-RPC spec for {name}")

        # Clone repository to temp directory
        repo_dir = self._clone_repository(source.repo, source.branch)

        try:
            # Extract JSON-RPC methods from Go files
            methods = self._extract_jsonrpc_methods(repo_dir, source.paths)

            # Generate OpenAPI specification
            openapi_spec = self._build_evm_openapi_spec(methods)

            # Write to output file
            self._write_openapi_spec(openapi_spec, source.output)

            # Generate MDX pages if enabled
            if self.config['generation']['auto_generate_pages']:
                self._generate_evm_mdx_pages(methods, name)

        finally:
            self._cleanup_temp_dir()

    def _generate_grpc_gateway(self, name: str, source: SourceRepo) -> None:
        """Generate OpenAPI spec for gRPC-Gateway endpoints"""
        logger.info(f"Generating gRPC-Gateway spec for {name}")

        # Clone repository to temp directory
        repo_dir = self._clone_repository(source.repo, source.branch)

        try:
            # Extract protobuf definitions
            proto_files = self._find_proto_files(repo_dir, source.paths)

            # Generate OpenAPI from protobuf using grpc-gateway tools
            openapi_spec = self._generate_from_proto(proto_files)

            # Write to output file
            self._write_openapi_spec(openapi_spec, source.output)

            # Generate MDX pages if enabled
            if self.config['generation']['auto_generate_pages']:
                self._generate_grpc_mdx_pages(openapi_spec, name)

        finally:
            self._cleanup_temp_dir()

    def _clone_repository(self, repo: str, branch: str) -> str:
        """Clone repository to temporary directory"""
        self.temp_dir = tempfile.mkdtemp()
        repo_url = f"https://github.com/{repo}.git"
        repo_dir = os.path.join(self.temp_dir, "repo")

        logger.info(f"Cloning {repo_url} (branch: {branch})")
        subprocess.run([
            "git", "clone", "--depth", "1", "--branch", branch, repo_url, repo_dir
        ], check=True, capture_output=True)

        return repo_dir

    def _extract_jsonrpc_methods(self, repo_dir: str, paths: List[str]) -> List[Dict[str, Any]]:
        """Extract JSON-RPC method definitions from Go files"""
        methods = []

        for path_pattern in paths:
            for go_file in Path(repo_dir).glob(path_pattern):
                if go_file.suffix == '.go':
                    methods.extend(self._parse_go_jsonrpc_methods(go_file))

        return methods

    def _parse_go_jsonrpc_methods(self, file_path: Path) -> List[Dict[str, Any]]:
        """Parse JSON-RPC methods from a Go file"""
        methods = []

        try:
            with open(file_path, 'r') as f:
                content = f.read()

            # Look for JSON-RPC method patterns
            # This is a simplified parser - you'd want more sophisticated parsing
            method_pattern = r'func\s+\(.*?\)\s+(\w+)\s*\([^)]*\)\s*\([^)]*\)\s*{'
            matches = re.finditer(method_pattern, content)

            for match in matches:
                method_name = match.group(1)
                if method_name.startswith(('Eth', 'Net', 'Web3', 'Debug')):
                    # Convert to snake_case JSON-RPC method name
                    rpc_name = self._camel_to_snake_case(method_name)
                    methods.append({
                        'name': rpc_name,
                        'go_function': method_name,
                        'file': str(file_path),
                        'description': self._extract_go_doc_comment(content, match.start())
                    })

        except Exception as e:
            logger.warning(f"Failed to parse {file_path}: {e}")

        return methods

    def _build_evm_openapi_spec(self, methods: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Build OpenAPI specification for EVM JSON-RPC methods"""
        spec = {
            "openapi": "3.0.0",
            "info": {
                "title": "Cosmos EVM JSON-RPC API",
                "version": "1.0.0",
                "description": "Ethereum-compatible JSON-RPC API for Cosmos EVM chains",
                **self.config['metadata']
            },
            "servers": self._build_servers("evm_rpc"),
            "paths": {},
            "components": {
                "schemas": self._get_jsonrpc_schemas()
            }
        }

        # Add path for each method
        for method in methods:
            spec["paths"]["/"] = spec["paths"].get("/", {})
            spec["paths"]["/"]["post"] = {
                "summary": method['name'],
                "description": method.get('description', f"Execute {method['name']} method"),
                "operationId": method['name'],
                "requestBody": self._build_jsonrpc_request_body(method),
                "responses": self._build_jsonrpc_responses(method),
                "tags": [self._get_method_tag(method['name'])]
            }

        return spec

    def _write_openapi_spec(self, spec: Dict[str, Any], output_path: str) -> None:
        """Write OpenAPI specification to file"""
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, 'w') as f:
            json.dump(spec, f, indent=2)

        logger.info(f"OpenAPI spec written to {output_path}")

    def _generate_evm_mdx_pages(self, methods: List[Dict[str, Any]], source_name: str) -> None:
        """Generate MDX pages for EVM methods"""
        output_dir = Path(self.config['generation']['pages_output']) / "evm"
        output_dir.mkdir(parents=True, exist_ok=True)

        for method in methods:
            page_content = self._build_evm_mdx_content(method)
            page_file = output_dir / f"{method['name'].replace('_', '-')}.mdx"

            with open(page_file, 'w') as f:
                f.write(page_content)

            logger.info(f"Generated MDX page: {page_file}")

    def _build_evm_mdx_content(self, method: Dict[str, Any]) -> str:
        """Build MDX content for an EVM method"""
        return f'''---
title: "{method['name']}"
description: "{method.get('description', f'Execute {method["name"]} method')}"
openapi: "POST /"
---

import {{ Tabs, Tab }} from '@mintlify/components'

<Info>
{method.get('description', f'This method executes the {method["name"]} JSON-RPC call.')}
</Info>

## Implementation Examples

{self._generate_code_examples(method)}

## CLI Usage

{self._generate_cli_examples(method)}

## Response Format

{self._generate_response_example(method)}
'''

    def _generate_code_examples(self, method: Dict[str, Any]) -> str:
        """Generate code examples for multiple languages"""
        examples = []

        for lang in self.config['generation']['code_examples']:
            if lang == 'curl':
                examples.append(self._generate_curl_example(method))
            elif lang == 'typescript':
                examples.append(self._generate_typescript_example(method))
            elif lang == 'go':
                examples.append(self._generate_go_example(method))
            elif lang == 'rust':
                examples.append(self._generate_rust_example(method))
            elif lang == 'python':
                examples.append(self._generate_python_example(method))

        return f"<Tabs>\n" + "\n".join(examples) + "\n</Tabs>"

    def _generate_curl_example(self, method: Dict[str, Any]) -> str:
        """Generate curl example"""
        return f'''  <Tab title="cURL">
    ```bash
    curl -X POST https://evm-rpc.cosmos.network \\
      -H "Content-Type: application/json" \\
      -d '{{
        "jsonrpc": "2.0",
        "method": "{method['name']}",
        "params": [],
        "id": 1
      }}'
    ```
  </Tab>'''

    # Helper methods
    def _camel_to_snake_case(self, name: str) -> str:
        """Convert CamelCase to snake_case"""
        s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
        return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

    def _cleanup_temp_dir(self) -> None:
        """Clean up temporary directory"""
        if self.temp_dir and os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)
            self.temp_dir = None

    # ... Additional helper methods would go here

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Generate OpenAPI specs for Cosmos documentation')
    parser.add_argument('--config', '-c', default='scripts/openapi-gen/config.yaml',
                       help='Configuration file path')
    parser.add_argument('--source', '-s', help='Generate for specific source only')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be generated')

    args = parser.parse_args()

    try:
        generator = OpenAPIGenerator(args.config)

        if args.dry_run:
            logger.info("Dry run mode - showing configuration")
            print(json.dumps(generator.config, indent=2))
            return

        if args.source:
            logger.info(f"Generating for source: {args.source}")
            # Generate for specific source
        else:
            generator.generate_all()

    except KeyboardInterrupt:
        logger.info("Generation cancelled by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()