#!/usr/bin/env python3
"""
Enhanced OpenAPI Generator for Cosmos EVM

Generates comprehensive OpenAPI specifications with:
- Interactive testing support
- Multi-language code examples
- Method categorization
- Real method discovery integration
"""

import json
import yaml
import os
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional
import logging
from jinja2 import Template
import argparse

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedOpenAPIGenerator:
    """Enhanced OpenAPI generator with comprehensive features"""

    def __init__(self, config_path: str, discovery_data: Optional[str] = None):
        self.config = self._load_config(config_path)
        self.discovery_data = self._load_discovery_data(discovery_data) if discovery_data else None

    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load configuration file"""
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)

    def _load_discovery_data(self, discovery_path: str) -> Dict[str, Any]:
        """Load method discovery data"""
        with open(discovery_path, 'r') as f:
            return json.load(f)

    def generate_comprehensive_openapi(self) -> Dict[str, Any]:
        """Generate comprehensive OpenAPI specification"""

        # Use discovery data if available, otherwise use configured methods
        if self.discovery_data:
            supported_methods = self.discovery_data.get('supported', {})
            logger.info(f"Using discovery data with {len(supported_methods)} supported methods")
        else:
            supported_methods = self._get_fallback_methods()
            logger.info("Using fallback method list")

        spec = {
            "openapi": "3.0.0",
            "info": {
                "title": "Cosmos EVM JSON-RPC API",
                "version": "1.0.0",
                "description": self._generate_description(),
                **self.config.get('metadata', {})
            },
            "servers": self._build_servers(),
            "paths": {},
            "components": {
                "schemas": self._build_schemas(),
                "securitySchemes": self._build_security_schemes()
            },
            "tags": self._build_tags(),
            "x-tagGroups": self._build_tag_groups()
        }

        # Add paths for each supported method
        for method, method_info in supported_methods.items():
            self._add_method_to_spec(spec, method, method_info)

        return spec

    def _generate_description(self) -> str:
        """Generate comprehensive API description"""
        return """
# Cosmos EVM JSON-RPC API

This API provides Ethereum-compatible JSON-RPC endpoints for Cosmos EVM chains.

## Compatibility Notice

This implementation is based on go-ethereum v1.10.x compatibility level.
Methods introduced in later versions may not be supported.

## Rate Limits

- Read operations: 1000 requests per minute
- Write operations: 100 requests per minute

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON |
| -32600 | Invalid Request | JSON is not a valid request object |
| -32601 | Method not found | Method does not exist |
| -32602 | Invalid params | Invalid method parameters |
| -32603 | Internal error | Internal JSON-RPC error |

## Getting Started

1. Connect to one of the server endpoints
2. Use standard Ethereum tooling (ethers.js, web3.py, etc.)
3. All methods follow JSON-RPC 2.0 specification
"""

    def _build_servers(self) -> List[Dict[str, str]]:
        """Build server definitions"""
        return self.config.get('servers', {}).get('evm_rpc', [])

    def _build_schemas(self) -> Dict[str, Any]:
        """Build comprehensive schemas"""
        return {
            "JsonRpcRequest": {
                "type": "object",
                "required": ["jsonrpc", "method", "id"],
                "properties": {
                    "jsonrpc": {
                        "type": "string",
                        "enum": ["2.0"],
                        "description": "JSON-RPC version"
                    },
                    "method": {
                        "type": "string",
                        "description": "Method name"
                    },
                    "params": {
                        "type": "array",
                        "description": "Method parameters"
                    },
                    "id": {
                        "oneOf": [
                            {"type": "string"},
                            {"type": "integer"}
                        ],
                        "description": "Request identifier"
                    }
                }
            },
            "JsonRpcResponse": {
                "type": "object",
                "required": ["jsonrpc", "id"],
                "properties": {
                    "jsonrpc": {
                        "type": "string",
                        "enum": ["2.0"]
                    },
                    "result": {
                        "description": "Method result (present on success)"
                    },
                    "error": {
                        "$ref": "#/components/schemas/JsonRpcError",
                        "description": "Error object (present on error)"
                    },
                    "id": {
                        "oneOf": [
                            {"type": "string"},
                            {"type": "integer"}
                        ]
                    }
                }
            },
            "JsonRpcError": {
                "type": "object",
                "required": ["code", "message"],
                "properties": {
                    "code": {
                        "type": "integer",
                        "description": "Error code"
                    },
                    "message": {
                        "type": "string",
                        "description": "Error message"
                    },
                    "data": {
                        "description": "Additional error data"
                    }
                }
            },
            "HexString": {
                "type": "string",
                "pattern": "^0x[0-9a-fA-F]*$",
                "description": "Hexadecimal string with 0x prefix"
            },
            "Address": {
                "type": "string",
                "pattern": "^0x[0-9a-fA-F]{40}$",
                "description": "20-byte Ethereum address"
            },
            "Hash": {
                "type": "string",
                "pattern": "^0x[0-9a-fA-F]{64}$",
                "description": "32-byte hash"
            },
            "BlockNumber": {
                "oneOf": [
                    {
                        "type": "string",
                        "pattern": "^0x[0-9a-fA-F]+$",
                        "description": "Hex-encoded block number"
                    },
                    {
                        "type": "string",
                        "enum": ["latest", "earliest", "pending"],
                        "description": "Block tag"
                    }
                ]
            }
        }

    def _build_security_schemes(self) -> Dict[str, Any]:
        """Build security schemes"""
        return {
            "ApiKey": {
                "type": "apiKey",
                "in": "header",
                "name": "Authorization",
                "description": "API key for rate limiting (if required)"
            }
        }

    def _build_tags(self) -> List[Dict[str, str]]:
        """Build method tags"""
        return [
            {"name": "Account", "description": "Account-related methods"},
            {"name": "Block", "description": "Block-related methods"},
            {"name": "Transaction", "description": "Transaction-related methods"},
            {"name": "Fee", "description": "Gas and fee-related methods"},
            {"name": "Filter", "description": "Event filter methods"},
            {"name": "Network", "description": "Network information methods"},
            {"name": "Web3", "description": "Web3 utility methods"},
            {"name": "Debug", "description": "Debug and tracing methods"},
            {"name": "TxPool", "description": "Transaction pool methods"}
        ]

    def _build_tag_groups(self) -> List[Dict[str, Any]]:
        """Build tag groups for better organization"""
        return [
            {
                "name": "Core Methods",
                "tags": ["Account", "Block", "Transaction"]
            },
            {
                "name": "Gas & Fees",
                "tags": ["Fee"]
            },
            {
                "name": "Events & Filters",
                "tags": ["Filter"]
            },
            {
                "name": "Network & Utilities",
                "tags": ["Network", "Web3"]
            },
            {
                "name": "Advanced",
                "tags": ["Debug", "TxPool"]
            }
        ]

    def _add_method_to_spec(self, spec: Dict[str, Any], method: str, method_info: Dict[str, Any]):
        """Add a method to the OpenAPI specification"""

        # Determine method category/tag
        category = method_info.get('category', 'Other')
        description = method_info.get('description', f'Execute {method}')

        # Build operation
        operation = {
            "summary": method,
            "description": f"{description}\n\n{self._build_method_description(method, method_info)}",
            "operationId": method,
            "tags": [category],
            "requestBody": {
                "required": True,
                "content": {
                    "application/json": {
                        "schema": self._build_request_schema(method, method_info),
                        "examples": self._build_request_examples(method, method_info)
                    }
                }
            },
            "responses": {
                "200": {
                    "description": "Successful response",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/JsonRpcResponse"
                            },
                            "examples": self._build_response_examples(method, method_info)
                        }
                    }
                },
                "400": {
                    "description": "Bad request",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/JsonRpcResponse"
                            }
                        }
                    }
                }
            },
            "x-codegen-request-body-name": "body"
        }

        # Add code examples
        operation["x-code-samples"] = self._build_code_samples(method, method_info)

        # Add to paths
        if "/" not in spec["paths"]:
            spec["paths"]["/"] = {}

        spec["paths"]["/"]["post"] = operation

    def _build_method_description(self, method: str, method_info: Dict[str, Any]) -> str:
        """Build detailed method description"""
        parts = []

        if 'min_geth_version' in method_info:
            parts.append(f"**Minimum go-ethereum version:** {method_info['min_geth_version']}")

        if 'response_sample' in method_info:
            parts.append("**Note:** This method has been verified to work on Cosmos EVM.")

        return "\n\n".join(parts) if parts else ""

    def _build_request_schema(self, method: str, method_info: Dict[str, Any]) -> Dict[str, Any]:
        """Build request schema for method"""
        schema = {
            "allOf": [
                {"$ref": "#/components/schemas/JsonRpcRequest"},
                {
                    "type": "object",
                    "properties": {
                        "method": {
                            "enum": [method]
                        },
                        "params": self._get_params_schema(method, method_info)
                    }
                }
            ]
        }
        return schema

    def _get_params_schema(self, method: str, method_info: Dict[str, Any]) -> Dict[str, Any]:
        """Get parameter schema for method"""
        # This would be enhanced with actual parameter definitions
        # For now, return a generic array
        return {
            "type": "array",
            "description": f"Parameters for {method}",
            "items": {}
        }

    def _build_request_examples(self, method: str, method_info: Dict[str, Any]) -> Dict[str, Any]:
        """Build request examples"""
        test_params = method_info.get('test_params', [])

        return {
            "example": {
                "summary": f"Example {method} request",
                "value": {
                    "jsonrpc": "2.0",
                    "method": method,
                    "params": test_params,
                    "id": 1
                }
            }
        }

    def _build_response_examples(self, method: str, method_info: Dict[str, Any]) -> Dict[str, Any]:
        """Build response examples"""
        examples = {}

        # Success example
        if 'response_sample' in method_info and method_info['response_sample']:
            examples["success"] = {
                "summary": "Successful response",
                "value": method_info['response_sample']
            }
        else:
            examples["success"] = {
                "summary": "Successful response",
                "value": {
                    "jsonrpc": "2.0",
                    "result": "0x...",
                    "id": 1
                }
            }

        # Error example
        examples["error"] = {
            "summary": "Error response",
            "value": {
                "jsonrpc": "2.0",
                "error": {
                    "code": -32602,
                    "message": "Invalid params"
                },
                "id": 1
            }
        }

        return examples

    def _build_code_samples(self, method: str, method_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Build code samples for multiple languages"""
        samples = []
        test_params = method_info.get('test_params', [])

        # Get code templates from config
        templates = self.config.get('code_templates', {})

        for lang, template_info in templates.items():
            if isinstance(template_info, dict) and 'template' in template_info:
                template_str = template_info['template']

                # Prepare template variables
                variables = {
                    'method': method,
                    'params': json.dumps(test_params),
                    'server_url': '{server_url}',
                    'function_name': method.replace('_', ''),
                    'parameters': self._build_function_params(method, test_params),
                    'return_type': 'any'
                }

                try:
                    template = Template(template_str)
                    code = template.render(**variables)

                    samples.append({
                        "lang": lang,
                        "source": code
                    })
                except Exception as e:
                    logger.warning(f"Failed to generate {lang} code sample for {method}: {e}")

        return samples

    def _build_function_params(self, method: str, test_params: List[Any]) -> str:
        """Build function parameters for code templates"""
        if not test_params:
            return ""

        param_names = []
        for i, param in enumerate(test_params):
            if isinstance(param, str):
                param_names.append(f"param{i}: string")
            elif isinstance(param, (int, float)):
                param_names.append(f"param{i}: number")
            elif isinstance(param, bool):
                param_names.append(f"param{i}: boolean")
            else:
                param_names.append(f"param{i}: any")

        return ", ".join(param_names)

    def _get_fallback_methods(self) -> Dict[str, Any]:
        """Get fallback method list when discovery data is not available"""
        categories = self.config.get('categories', {}).get('evm', {})
        methods = {}

        for category, method_list in categories.items():
            for method in method_list:
                methods[method] = {
                    'category': category.replace('_methods', '').title(),
                    'description': f'{method} method',
                    'test_params': [],
                    'min_geth_version': '1.9.0'
                }

        return methods

    def generate_mdx_pages(self, supported_methods: Dict[str, Any], output_dir: str):
        """Generate MDX pages for each method"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        for method, method_info in supported_methods.items():
            page_content = self._build_mdx_page(method, method_info)
            page_file = output_path / f"{method.replace('_', '-')}.mdx"

            with open(page_file, 'w') as f:
                f.write(page_content)

            logger.info(f"Generated MDX page: {page_file}")

    def _build_mdx_page(self, method: str, method_info: Dict[str, Any]) -> str:
        """Build MDX page content for a method"""
        category = method_info.get('category', 'Other')
        description = method_info.get('description', f'Execute {method}')
        test_params = method_info.get('test_params', [])

        content = f'''---
title: "{method}"
description: "{description}"
openapi: "POST /"
---

import {{ Tabs, Tab }} from '@mintlify/components'

<Info>
{description}
</Info>

## Method Details

- **Category:** {category}
- **Method:** `{method}`
- **Parameters:** {len(test_params)} parameter(s)

## Code Examples

<Tabs>
  <Tab title="cURL">
    ```bash
    curl -X POST {{{{ server_url }}}} \\
      -H "Content-Type: application/json" \\
      -d '{{
        "jsonrpc": "2.0",
        "method": "{method}",
        "params": {json.dumps(test_params)},
        "id": 1
      }}'
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript
    const {{ JsonRpcProvider }} = require('ethers');

    const provider = new JsonRpcProvider('{{{{ server_url }}}}');

    async function {method.replace('_', '')}() {{
      const result = await provider.send('{method}', {json.dumps(test_params)});
      return result;
    }}
    ```
  </Tab>

  <Tab title="Python">
    ```python
    import requests
    import json

    def {method.replace('_', '_')}():
        payload = {{
            "jsonrpc": "2.0",
            "method": "{method}",
            "params": {json.dumps(test_params)},
            "id": 1
        }}

        response = requests.post('{{{{ server_url }}}}', json=payload)
        return response.json()['result']
    ```
  </Tab>
</Tabs>

## Parameters

'''

        if test_params:
            for i, param in enumerate(test_params):
                content += f"- **Parameter {i + 1}:** `{param}` ({type(param).__name__})\n"
        else:
            content += "This method takes no parameters.\n"

        content += '''
## Response

The method returns a JSON-RPC response with the result in the `result` field.

## Error Handling

Common errors for this method:

| Error Code | Description |
|------------|-------------|
| -32602 | Invalid params |
| -32603 | Internal error |
'''

        return content

def main():
    parser = argparse.ArgumentParser(description="Generate enhanced OpenAPI specification")
    parser.add_argument("--config", default="scripts/openapi-gen/config.yaml", help="Configuration file")
    parser.add_argument("--discovery", help="Method discovery JSON file")
    parser.add_argument("--output", default="docs/api-specs/cosmos-evm-complete.json", help="Output OpenAPI file")
    parser.add_argument("--generate-pages", action="store_true", help="Generate MDX pages")
    parser.add_argument("--pages-dir", default="docs/api-reference/evm", help="MDX pages output directory")

    args = parser.parse_args()

    # Create generator
    generator = EnhancedOpenAPIGenerator(args.config, args.discovery)

    # Generate OpenAPI spec
    spec = generator.generate_comprehensive_openapi()

    # Write OpenAPI spec
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    with open(args.output, 'w') as f:
        json.dump(spec, f, indent=2)

    logger.info(f"OpenAPI specification written to {args.output}")

    # Generate MDX pages if requested
    if args.generate_pages:
        if generator.discovery_data:
            supported_methods = generator.discovery_data.get('supported', {})
        else:
            supported_methods = generator._get_fallback_methods()

        generator.generate_mdx_pages(supported_methods, args.pages_dir)
        logger.info(f"MDX pages generated in {args.pages_dir}")

    print(f"Generated OpenAPI spec with {len(spec.get('paths', {}))} endpoints")

if __name__ == "__main__":
    main()