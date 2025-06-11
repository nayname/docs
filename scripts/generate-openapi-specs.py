#!/usr/bin/env python3
"""
Generate OpenAPI 3.0 Specifications from Protobuf Files

This script generates proper OpenAPI specs that can be used with Mintlify
to create interactive API documentation with code samples and playgrounds.

Enhanced to prioritize EVM modules over Cosmos SDK modules when there's overlap.
"""

import os
import re
import json
import yaml
from pathlib import Path
from typing import Dict, List, Tuple, Any, Set
import argparse

def find_proto_files(proto_dir: str) -> List[Path]:
    """Find all .proto files in the given directory."""
    proto_path = Path(proto_dir)
    if not proto_path.exists():
        print(f"Warning: {proto_dir} does not exist")
        return []
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

def get_module_name(package: str, file_source: str) -> str:
    """Extract module name from package with proper handling for EVM modules."""
    if not package:
        return "misc"

    parts = package.split('.')

    if file_source == "evm":
        # Handle cosmos.evm packages
        if len(parts) >= 3 and parts[0] == 'cosmos' and parts[1] == 'evm':
            return parts[2]  # e.g., cosmos.evm.vm.v1 -> vm
        elif len(parts) >= 2 and parts[0] == 'cosmos':
            return parts[1]  # e.g., cosmos.evm -> evm
        else:
            return parts[0]
    else:
        # Handle cosmos SDK packages
        if len(parts) >= 2 and parts[0] == 'cosmos':
            return parts[1]  # e.g., cosmos.bank.v1beta1 -> bank
        else:
            return parts[0]

def process_modules_with_priority(cosmos_modules: Dict[str, Any], evm_modules: Dict[str, Any]) -> Dict[str, Any]:
    """Merge modules with EVM taking priority over Cosmos SDK modules."""
    print("\n🔄 Processing module priorities...")

    # Start with cosmos modules
    final_modules = cosmos_modules.copy()

    # Track overlaps for reporting
    overlaps = []

    # Override with EVM modules
    for module_name, evm_data in evm_modules.items():
        if module_name in final_modules:
            overlaps.append(module_name)
            print(f"   ⚡ EVM module '{module_name}' overriding Cosmos SDK version")
        else:
            print(f"   ➕ Adding EVM-specific module '{module_name}'")

        final_modules[module_name] = evm_data
        # Mark as EVM source for different handling if needed
        final_modules[module_name]["source"] = "evm"

    # Mark cosmos modules
    for module_name in cosmos_modules:
        if module_name not in evm_modules:
            final_modules[module_name]["source"] = "cosmos"

    if overlaps:
        print(f"   📝 EVM modules took priority for: {', '.join(overlaps)}")

    return final_modules

def generate_combined_openapi_spec(all_modules: Dict[str, Any], base_url: str = "https://rest.cosmos.network") -> Dict[str, Any]:
    """Generate a combined OpenAPI spec for all modules."""

    spec = {
        "openapi": "3.0.3",
        "info": {
            "title": "Cosmos SDK & EVM REST API",
            "description": "Complete REST API reference for all Cosmos SDK and EVM modules. EVM-specific modules take precedence where applicable.",
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
        source = module_data.get("source", "cosmos")

        # Generate appropriate base path
        if package:
            if source == "evm" and package.startswith("cosmos.evm"):
                # EVM modules use cosmos/evm prefix
                base_path = "/" + package.replace(".", "/")
            else:
                # Standard cosmos modules
                base_path = "/" + package.replace(".", "/")
        else:
            base_path = f"/cosmos/{module_name}/v1beta1"

        # Add tag with source indicator
        tag_description = f"{module_name.title()} module operations"
        if source == "evm":
            tag_description += " (EVM-enhanced)"

        spec["tags"].append({
            "name": module_name.title(),
            "description": tag_description
        })

        for service_name, methods in services:
            service_tag = f"{module_name.title()}"

            for method_name, request_type, response_type in methods:
                method_lower = method_name.lower()

                # Determine HTTP method and path
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
    parser.add_argument("--output-dir", default=".mintlify", help="Output directory for OpenAPI specs")
    parser.add_argument("--base-url", default="https://rest.cosmos.network", help="Base URL for API server")

    args = parser.parse_args()

    print("🔍 Generating OpenAPI specifications from protobuf files...")

    # Find proto files from both sources
    cosmos_sdk_files = find_proto_files(f"{args.proto_dir}/cosmos-sdk")
    evm_files = find_proto_files(f"{args.proto_dir}/evm")

    print(f"Found {len(cosmos_sdk_files)} Cosmos SDK protobuf files")
    print(f"Found {len(evm_files)} EVM protobuf files")

    # Process Cosmos SDK modules
    cosmos_modules = {}
    for proto_file in cosmos_sdk_files:
        package, services = extract_package_and_services(proto_file)

        if not services:
            continue

        module_name = get_module_name(package, "cosmos")

        if module_name not in cosmos_modules:
            cosmos_modules[module_name] = {"package": package, "services": []}

        cosmos_modules[module_name]["services"].extend(services)

    # Process EVM modules
    evm_modules = {}
    for proto_file in evm_files:
        package, services = extract_package_and_services(proto_file)

        if not services:
            continue

        module_name = get_module_name(package, "evm")

        if module_name not in evm_modules:
            evm_modules[module_name] = {"package": package, "services": []}

        evm_modules[module_name]["services"].extend(services)

    print(f"📦 Cosmos SDK modules: {list(cosmos_modules.keys())}")
    print(f"⚡ EVM modules: {list(evm_modules.keys())}")

    # Merge with EVM priority
    final_modules = process_modules_with_priority(cosmos_modules, evm_modules)

    print(f"✅ Final modules ({len(final_modules)}): {list(final_modules.keys())}")

    # Create output directory
    output_path = Path(args.output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate combined spec
    combined_spec = generate_combined_openapi_spec(final_modules, args.base_url)

    # Write output files
    json_file = output_path / "cosmos-sdk-complete.json"
    yaml_file = output_path / "cosmos-sdk-complete.yaml"

    with open(json_file, 'w') as f:
        json.dump(combined_spec, f, indent=2)

    with open(yaml_file, 'w') as f:
        yaml.dump(combined_spec, f, default_flow_style=False, sort_keys=False)

    # Calculate statistics
    total_endpoints = sum(len(methods) for module in final_modules.values() for _, methods in module["services"])
    evm_endpoints = sum(len(methods) for module in final_modules.values() if module.get("source") == "evm" for _, methods in module["services"])

    print(f"\n✅ Generated OpenAPI specifications:")
    print(f"   - 1 combined specification ({json_file.stat().st_size // 1024}KB)")
    print(f"   - {total_endpoints} total endpoints ({evm_endpoints} EVM-enhanced)")
    print(f"   - Output: {args.output_dir}/")
    print(f"\n📝 Next steps:")
    print(f"   1. Generate interactive docs:")
    print(f"      npx @mintlify/scraping@latest openapi-file {json_file} -o docs/api-reference/cosmos-rest")
    print(f"   2. Update navigation in docs.json if new endpoints were added")

if __name__ == "__main__":
    main()