#!/usr/bin/env python3
"""
Generate OpenAPI 3.0 Specifications from Protobuf Files

This script generates proper OpenAPI specs that can be used with Mintlify
to create interactive API documentation with code samples and playgrounds.
"""

import os
import re
import json
import yaml
from pathlib import Path
from typing import Dict, List, Tuple, Any
import argparse

def find_proto_files(proto_dir: str) -> List[Path]:
    """Find all .proto files in the given directory."""
    proto_path = Path(proto_dir)
    return list(proto_path.glob('**/*.proto'))

def extract_package_and_services(proto_file: Path) -> Tuple[str, List[Tuple[str, List[str]]]]:
    """Extract package name and services from a proto file."""
    try:
        content = proto_file.read_text()

        # Extract package
        package_match = re.search(r'package\s+([^;]+)', content)
        package = package_match.group(1).strip() if package_match else ""

        # Find all services
        service_pattern = re.compile(r'service\s+(\w+)\s*\{([^}]+)\}', re.DOTALL)
        services = []

        for match in service_pattern.finditer(content):
            service_name = match.group(1)
            service_body = match.group(2)

            # Extract RPC methods from service body
            rpc_pattern = re.compile(r'rpc\s+(\w+)\s*\(([^)]+)\)\s+returns\s+\(([^)]+)\)')
            methods = []

            for rpc_match in rpc_pattern.finditer(service_body):
                method_name = rpc_match.group(1)
                request_type = rpc_match.group(2).strip()
                response_type = rpc_match.group(3).strip()
                methods.append((method_name, request_type, response_type))

            if methods:
                services.append((service_name, methods))

        return package, services
    except Exception as e:
        print(f"Error parsing {proto_file}: {e}")
        return "", []

def generate_combined_openapi_spec(all_modules: Dict[str, Any], base_url: str = "https://rest.cosmos.network") -> Dict[str, Any]:
    """Generate a combined OpenAPI spec for all modules."""

    spec = {
        "openapi": "3.0.3",
        "info": {
            "title": "Cosmos SDK REST API",
            "description": "Complete REST API reference for all Cosmos SDK modules",
            "version": "1.0.0",
            "contact": {
                "name": "Cosmos SDK Documentation",
                "url": "https://docs.cosmos.network"
            }
        },
        "servers": [
            {
                "url": base_url,
                "description": "Cosmos Network Mainnet"
            },
            {
                "url": "https://testnet-rest.cosmos.network",
                "description": "Cosmos Network Testnet"
            },
            {
                "url": "http://localhost:1317",
                "description": "Local Development"
            }
        ],
        "paths": {},
        "components": {
            "schemas": {},
            "responses": {
                "Error": {
                    "description": "Error response",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "code": {"type": "integer"},
                                    "message": {"type": "string"},
                                    "details": {"type": "array", "items": {"type": "object"}}
                                }
                            }
                        }
                    }
                }
            }
        },
        "tags": []
    }

    for module_name, module_data in all_modules.items():
        package = module_data["package"]
        services = module_data["services"]

        if package:
            base_path = "/" + package.replace(".", "/")
        else:
            base_path = f"/cosmos/{module_name}/v1beta1"

        spec["tags"].append({
            "name": module_name.title(),
            "description": f"{module_name.title()} module operations"
        })

        for service_name, methods in services:
            service_tag = f"{module_name.title()}"

            for method_name, request_type, response_type in methods:
                method_lower = method_name.lower()

                if service_name.lower() == "query" or method_lower.startswith("get") or method_lower in ["params", "balance", "balances", "validators"]:
                    http_method = "get"
                    path = f"{base_path}/{method_lower}"
                else:
                    http_method = "post"
                    path = f"{base_path}/{method_lower}"

                operation = {
                    "tags": [service_tag],
                    "summary": f"{method_name}",
                    "description": f"{method_name} operation for {module_name} module ({service_name} service)",
                    "operationId": f"{module_name}_{service_name}_{method_name}",
                    "responses": {
                        "200": {
                            "description": "Successful response",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "result": {"type": "object"}
                                        }
                                    }
                                }
                            }
                        },
                        "400": {"$ref": "#/components/responses/Error"},
                        "404": {"$ref": "#/components/responses/Error"},
                        "500": {"$ref": "#/components/responses/Error"}
                    }
                }

                if http_method == "post":
                    operation["requestBody"] = {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {"type": "object"}
                                    }
                                }
                            }
                        }
                    }

                if http_method == "get":
                    operation["parameters"] = [
                        {
                            "name": "height",
                            "in": "query",
                            "description": "Block height to query",
                            "required": False,
                            "schema": {"type": "string"}
                        },
                        {
                            "name": "prove",
                            "in": "query",
                            "description": "Include merkle proof in response",
                            "required": False,
                            "schema": {"type": "boolean", "default": False}
                        }
                    ]

                if path not in spec["paths"]:
                    spec["paths"][path] = {}

                spec["paths"][path][http_method] = operation

    return spec

def main():
    parser = argparse.ArgumentParser(description="Generate OpenAPI specifications from protobuf files")
    parser.add_argument("--proto-dir", default="proto-sources", help="Directory containing protobuf files")
    parser.add_argument("--output-dir", default="docs/api-specs", help="Output directory for OpenAPI specs")
    parser.add_argument("--base-url", default="https://rest.cosmos.network", help="Base URL for API server")

    args = parser.parse_args()

    print("🔍 Generating OpenAPI specifications from protobuf files...")

    # Find all proto files
    cosmos_sdk_files = find_proto_files(f"{args.proto_dir}/cosmos-sdk")
    evm_files = find_proto_files(f"{args.proto_dir}/evm")

    all_files = cosmos_sdk_files + evm_files
    print(f"Found {len(all_files)} protobuf files")

    # Group services by module
    modules = {}

    for proto_file in all_files:
        package, services = extract_package_and_services(proto_file)

        if not services:
            continue

        # Extract module name from package
        if package:
            parts = package.split('.')
            if len(parts) >= 2:
                if parts[0] == 'cosmos':
                    module_name = parts[1]
                elif parts[0] == 'ethermint':
                    module_name = parts[1]
                else:
                    module_name = parts[0]
            else:
                module_name = parts[0]
        else:
            module_name = "misc"

        if module_name not in modules:
            modules[module_name] = {"package": package, "services": []}

        modules[module_name]["services"].extend(services)

    print(f"Found {len(modules)} modules: {list(modules.keys())}")

    # Create output directory
    output_path = Path(args.output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate combined spec
    combined_spec = generate_combined_openapi_spec(modules, args.base_url)

    with open(output_path / "cosmos-sdk-complete.json", 'w') as f:
        json.dump(combined_spec, f, indent=2)

    with open(output_path / "cosmos-sdk-complete.yaml", 'w') as f:
        yaml.dump(combined_spec, f, default_flow_style=False, sort_keys=False)

    total_endpoints = sum(len(methods) for module in modules.values() for _, methods in module["services"])
    print(f"\n✅ Generated OpenAPI specifications:")
    print(f"   - 1 combined specification")
    print(f"   - {total_endpoints} total endpoints")
    print(f"   - Output: {args.output_dir}/")
    print(f"\n📝 Next steps:")
    print(f"   1. Install Mintlify CLI: npm i -g mintlify")
    print(f"   2. Generate docs: npx @mintlify/scraping@latest openapi-file {args.output_dir}/cosmos-sdk-complete.json -o docs/api-reference")

if __name__ == "__main__":
    main()