# Cosmos EVM OpenAPI Generation

This directory contains tools for generating comprehensive, accurate API documentation for Cosmos EVM chains by testing live endpoints and creating OpenAPI specifications.

## Overview

The generation system solves a critical problem: **How do you know which Ethereum JSON-RPC methods are actually supported?**

Instead of assuming compatibility, these tools:
1. **Test live endpoints** to discover what's actually implemented
2. **Generate accurate documentation** based on real responses
3. **Create interactive API specs** with multi-language examples
4. **Generate client SDKs** for type-safe development

## Quick Start

```bash
# Install dependencies
pip install requests jinja2 pyyaml

# Start your local node
./local_node.sh

# Run complete generation
./scripts/openapi-gen/run_complete_generation.sh
```

## Files

| File | Purpose |
|------|---------|
| `config.yaml` | Configuration for generation process |
| `method_discovery.py` | Tests live endpoints to find supported methods |
| `enhanced_generator.py` | Generates comprehensive OpenAPI specs |
| `run_complete_generation.sh` | Runs the complete process |
| `README.md` | This documentation |

## Generated Outputs

### Documentation Files

- `docs/api-specs/cosmos-evm-complete.json` - Complete OpenAPI 3.0 specification
- `docs/api-specs/compatibility_report.md` - Human-readable compatibility report
- `docs/api-specs/method_discovery.json` - Machine-readable test results
- `docs/api-specs/cosmos-evm-postman.json` - Postman collection for testing
- `docs/api-reference/evm/*.mdx` - Individual method documentation pages

### Client SDKs (Optional)

- `generated-sdks/typescript/` - TypeScript/JavaScript client
- `generated-sdks/python/` - Python client
- `generated-sdks/go/` - Go client

## Method Discovery

The discovery process tests standard Ethereum JSON-RPC methods to determine which are supported:

### Core Methods Tested

**Account Methods:**
- `eth_getBalance` - Get account balance
- `eth_getTransactionCount` - Get transaction count
- `eth_getCode` - Get contract code
- `eth_getStorageAt` - Get storage value

**Block Methods:**
- `eth_blockNumber` - Get latest block number
- `eth_getBlockByNumber` - Get block by number
- `eth_getBlockByHash` - Get block by hash

**Transaction Methods:**
- `eth_sendTransaction` - Send transaction
- `eth_sendRawTransaction` - Send raw transaction
- `eth_call` - Execute call
- `eth_estimateGas` - Estimate gas

**Fee Methods (EIP-1559):**
- `eth_gasPrice` - Get gas price
- `eth_feeHistory` - Get fee history
- `eth_maxPriorityFeePerGas` - Get max priority fee

**And many more...**

### Test Results

Methods are categorized as:
- ✅ **Supported** - Method works and returns valid responses
- ❌ **Unsupported** - Method returns "method not found" error
- ⚠️ **Error** - Method exists but has issues (invalid params, etc.)

## Configuration

### Basic Configuration (`config.yaml`)

```yaml
# Source repositories to analyze
sources:
  cosmos-evm:
    repo: "cosmos/evm"
    branch: "main"
    type: "evm-jsonrpc"
    paths:
      - "x/vm/keeper/*.go"
      - "rpc/backend/*.go"

# Server endpoints
servers:
  evm_rpc:
    - url: "https://evm-rpc.cosmos.network"
      description: "Cosmos EVM Mainnet"
    - url: "http://localhost:8545"
      description: "Local Development"

# Code templates for examples
code_templates:
  javascript:
    template: |
      const provider = new JsonRpcProvider('{server_url}');
      const result = await provider.send('{method}', {params});
```

### Adding Custom Methods

To test custom precompile methods, edit `method_discovery.py`:

```python
def get_custom_test_methods() -> List[MethodTest]:
    return [
        MethodTest(
            method="cosmos_getValidators",
            params=[],
            description="Get Cosmos validators",
            category="Cosmos",
            min_geth_version="N/A"
        ),
        # Add more custom methods
    ]
```

## Generated OpenAPI Features

### Interactive Documentation

The OpenAPI spec includes:

- **Complete schemas** for all request/response types
- **Example requests/responses** from actual testing
- **Multi-language code samples** (curl, JavaScript, Python, Go)
- **Error documentation** with common error codes
- **Method categorization** for better organization

### Example OpenAPI Output

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Cosmos EVM JSON-RPC API",
    "version": "1.0.0"
  },
  "paths": {
    "/": {
      "post": {
        "summary": "eth_getBalance",
        "operationId": "eth_getBalance",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "allOf": [
                  {"$ref": "#/components/schemas/JsonRpcRequest"},
                  {
                    "properties": {
                      "method": {"enum": ["eth_getBalance"]},
                      "params": {
                        "type": "array",
                        "items": [
                          {"$ref": "#/components/schemas/Address"},
                          {"$ref": "#/components/schemas/BlockNumber"}
                        ]
                      }
                    }
                  }
                ]
              },
              "examples": {
                "example": {
                  "value": {
                    "jsonrpc": "2.0",
                    "method": "eth_getBalance",
                    "params": ["0x...", "latest"],
                    "id": 1
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {"$ref": "#/components/schemas/JsonRpcResponse"}
              }
            }
          }
        },
        "x-code-samples": [
          {
            "lang": "javascript",
            "source": "const balance = await provider.getBalance('0x...');"
          }
        ]
      }
    }
  }
}
```

## Integration Examples

### Mintlify Documentation

Add to your `docs.json`:

```json
{
  "openapi": "/api-specs/cosmos-evm-complete.json"
}
```

### Client SDK Usage

```typescript
// Generated TypeScript client
import { CosmosEvmApi, Configuration } from 'cosmos-evm-client';

const config = new Configuration({
  basePath: 'http://localhost:8545'
});

const api = new CosmosEvmApi(config);

// Type-safe method calls
const balance = await api.ethGetBalance({
  address: '0x...',
  block: 'latest'
});
```

### Postman Testing

1. Import `docs/api-specs/cosmos-evm-postman.json`
2. Set environment variable `baseUrl` to your RPC endpoint
3. Test all supported methods interactively

## Advanced Usage

### Testing Multiple Networks

```bash
# Test mainnet compatibility
RPC_URL="https://evm-rpc.cosmos.network" \
  python3 scripts/openapi-gen/method_discovery.py \
  --output mainnet_compatibility.md

# Test testnet compatibility
RPC_URL="https://testnet-evm-rpc.cosmos.network" \
  python3 scripts/openapi-gen/method_discovery.py \
  --output testnet_compatibility.md

# Compare results
diff mainnet_compatibility.md testnet_compatibility.md
```

### Custom Code Templates

Add new language templates to `config.yaml`:

```yaml
code_templates:
  rust:
    template: |
      use serde_json::json;
      use reqwest::Client;

      async fn {function_name}({parameters}) -> Result<Value, Error> {
          let client = Client::new();
          let payload = json!({
              "jsonrpc": "2.0",
              "method": "{method}",
              "params": {params},
              "id": 1
          });

          let response = client.post("{server_url}")
              .json(&payload)
              .send()
              .await?;

          let result: Value = response.json().await?;
          Ok(result)
      }
```

### Continuous Integration

Monitor API compatibility over time:

```yaml
# .github/workflows/api-compatibility.yml
name: API Compatibility Check

on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

jobs:
  check-compatibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Test API compatibility
        run: |
          pip install requests jinja2 pyyaml
          ./scripts/openapi-gen/run_complete_generation.sh

      - name: Check for changes
        run: |
          if git diff --quiet docs/api-specs/; then
            echo "No changes detected"
          else
            echo "API compatibility changes detected!"
            git diff docs/api-specs/
            # Optionally notify team
          fi
```

## Troubleshooting

### Common Issues

**"Connection refused" errors:**
```bash
# Ensure your node is running
curl -X POST http://localhost:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'
```

**"Method not found" for expected methods:**
- Check your node configuration
- Verify JSON-RPC is enabled in `app.toml`
- Check which API namespaces are enabled

**SSL certificate errors:**
```bash
# For development/testing, you can bypass SSL verification
python3 scripts/openapi-gen/method_discovery.py \
  --rpc-url https://your-node.com \
  --skip-ssl-verify
```

### Debug Mode

Enable verbose logging:

```bash
export PYTHONPATH="$PWD/scripts/openapi-gen"
python3 -c "
import logging
logging.basicConfig(level=logging.DEBUG)
import method_discovery
# Run discovery with debug logging
"
```

## Contributing

To add support for new method categories or improve templates:

1. **Fork the repository**
2. **Add new test methods** to `method_discovery.py`
3. **Update code templates** in `config.yaml`
4. **Test with your changes**
5. **Submit a pull request**

### Adding New Method Categories

```python
# In method_discovery.py
def get_cosmos_specific_methods() -> List[MethodTest]:
    return [
        MethodTest(
            "cosmos_getStakingInfo",
            ["cosmosvaloper1..."],
            "Get staking information",
            "Cosmos Staking"
        ),
        MethodTest(
            "cosmos_getIBCChannels",
            [],
            "Get IBC channels",
            "Cosmos IBC"
        )
    ]
```

This system ensures your API documentation stays accurate and helpful for developers building on Cosmos EVM.