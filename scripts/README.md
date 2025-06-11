# API Development & Testing Scripts

This directory contains comprehensive tooling for developing, testing, and maintaining API documentation for Cosmos SDK and EVM chains.

## Quick Start

### API Testing
```bash
# Make script executable
chmod +x run_api_tests.sh

# Test both APIs with default endpoints
./run_api_tests.sh

# Test with custom endpoints
./run_api_tests.sh --rest-url https://api.cosmos.network --evm-url https://evm-rpc.cosmos.network
```

### API Discovery & Documentation Generation
```bash
# Sync latest protobuf definitions
./sync-protos.sh

# Generate OpenAPI specifications
python3 generate-openapi-specs.py

# Discover EVM JSON-RPC methods
python3 discover-jsonrpc-methods.py --rpc-url https://evm-rpc.cosmos.network
```

## Scripts Overview

### **Testing Scripts**
| Script | Purpose | Key Features |
|--------|---------|--------------|
| `run_api_tests.sh` | Main test runner with environment management | Auto venv, colorized output, flexible config |
| `test_cosmos_rest.py` | Cosmos REST API query endpoint tests | 28 endpoints, 96%+ success rate |
| `test_evm_jsonrpc.py` | EVM JSON-RPC API comprehensive tests | 27 methods, full filter lifecycle |

### **Documentation Generation**
| Script | Purpose | Key Features |
|--------|---------|--------------|
| `generate-openapi-specs.py` | Generate OpenAPI specs from protobuf files | EVM priority, combined specs, proper HTTP methods |
| `discover-jsonrpc-methods.py` | Discover and document EVM JSON-RPC methods | Live endpoint discovery, interactive docs |
| `sync-protos.sh` | Sync protobuf definitions from source repos | Automated updates, shallow clones |

### **Configuration & Setup**
| File | Purpose | Key Features |
|------|---------|--------------|
| `setup-webhooks.md` | GitHub webhook configuration guide | Auto-regeneration, security best practices |
| `README.md` | This comprehensive documentation | Complete usage guide |

## Detailed Usage

### API Testing (`run_api_tests.sh`)

**Features:**
- **Automatic Python environment management** - Creates/destroys temporary venv
- **Dependency installation** - Installs required Python packages automatically
- **Colorized output** - Easy-to-read test results
- **Flexible configuration** - Support for custom URLs and test subsets
- **Clean exit codes** - Proper exit codes for CI/CD integration

**Command Line Options:**
```bash
./run_api_tests.sh [OPTIONS]

OPTIONS:
    --rest-url URL          Cosmos REST API URL (default: http://localhost:1317)
    --evm-url URL           EVM JSON-RPC URL (default: http://localhost:8545)
    --cosmos-address ADDR   Test address for Cosmos tests (default: cosmos1...)
    --eth-address ADDR      Test address for EVM tests (default: 0x742d...)
    --rest-only             Only run Cosmos REST API tests
    --evm-only              Only run EVM JSON-RPC tests
    --verbose               Enable verbose output
    --help, -h              Show help message
```

**Example Usage:**
```bash
# Local development
./run_api_tests.sh

# Production testing with real addresses
./run_api_tests.sh \
  --rest-url https://api.cosmos.network \
  --evm-url https://evm-rpc.cosmos.network \
  --cosmos-address cosmos1abc123def456... \
  --eth-address 0x742d35cc6644c068532fddb11B4C36A58D6D3eAb

# CI/CD integration
./run_api_tests.sh --rest-url $REST_URL --evm-url $EVM_URL
echo "Exit code: $?"
```

### Cosmos REST API Tests (`test_cosmos_rest.py`)

**Coverage:**
- **Query operations only** - Tests valid GET endpoints (28 endpoints)
- **Comprehensive modules** - Core infrastructure, auth, bank, staking, governance, distribution, etc.
- **Address-aware testing** - Includes account-specific tests when valid address provided
- **Response validation** - Checks expected response structure
- **96%+ success rate** - Highly reliable endpoint testing

**Important:** Does not test state-changing operations (these require signed transactions via `/cosmos/tx/v1beta1/txs`)

### EVM JSON-RPC Tests (`test_evm_jsonrpc.py`)

**Coverage:**
- **Full JSON-RPC coverage** - Network, blocks, accounts, transactions, gas, filters, web3 (27 methods)
- **Type validation** - Ensures responses match expected data types
- **Filter lifecycle testing** - Creates, uses, and cleans up filters
- **Real transaction data** - Uses actual blockchain data when available
- **88%+ success rate** - Comprehensive method validation

### OpenAPI Generation (`generate-openapi-specs.py`)

**Features:**
- **Protobuf parsing** - Extracts services and methods from .proto files
- **EVM priority** - EVM modules override Cosmos SDK modules when there's overlap
- **Query-only generation** - Only generates GET endpoints for Query service methods
- **Transaction-aware** - Excludes non-query methods that require signed transactions
- **Combined specifications** - Generates unified OpenAPI spec for all modules
- **Mintlify compatibility** - Output ready for interactive documentation

**Usage:**
```bash
# Generate with default settings
python3 generate-openapi-specs.py

# Custom configuration
python3 generate-openapi-specs.py \
  --proto-dir ./proto-sources \
  --output-dir ./.mintlify \
  --base-url https://api.cosmos.network
```

### EVM Method Discovery (`discover-jsonrpc-methods.py`)

**Features:**
- **Live endpoint discovery** - Queries running RPC for supported methods
- **Source code analysis** - Analyzes codebase for method definitions
- **Interactive documentation** - Generates Mintlify-compatible pages
- **Method categorization** - Groups methods by functionality
- **Real examples** - Includes working code samples

**Usage:**
```bash
# Discover from live endpoint
python3 discover-jsonrpc-methods.py --rpc-url https://evm-rpc.cosmos.network

# Analyze local codebase
python3 discover-jsonrpc-methods.py --source-dir ./cosmos-evm
```

### Proto Sync (`sync-protos.sh`)

**Features:**
- **Automated updates** - Pulls latest protobuf definitions from source repos
- **Shallow clones** - Efficient repository cloning
- **Multi-source support** - Handles both Cosmos SDK and EVM repositories
- **File counting** - Reports number of synced files

**Usage:**
```bash
# Sync all protobuf sources
./sync-protos.sh

# The script automatically:
# 1. Clones cosmos/cosmos-sdk and cosmos/evm repositories
# 2. Copies protobuf files to proto-sources/
# 3. Reports sync statistics
```

## Understanding Test Results

### Success Indicators
- **Green checkmarks** = Test passed
- **Sample data** = Preview of returned data
- **Response times** = API performance metrics

### Failure Indicators
- **Red X marks** = Test failed
- **Warning messages** = Specific error details
- **Suggested fixes** = Troubleshooting hints

### Test Summary
Each run provides:
- Total tests executed
- Pass/fail counts
- Success rate percentage
- Average response time
- Detailed failure list

## Important Notes

### Cosmos REST API Limitations
The Cosmos REST tests only cover **query operations** (GET requests). State-changing operations require signed transactions:
- Sending tokens (`MsgSend`)
- Delegating stake (`MsgDelegate`)
- Voting on proposals (`MsgVote`)
- etc.

These must be submitted to `/cosmos/tx/v1beta1/txs`. See [Transaction Operations](../docs/api-reference/cosmos-rest/tx-post.mdx) for details.

### Address Requirements
- **Cosmos addresses**: Must be valid bech32 format (e.g., `cosmos1...`)
- **Ethereum addresses**: Must be valid hex format (e.g., `0x...`)
- Using placeholder addresses will skip account-specific tests

### OpenAPI Generation
The OpenAPI generator has been updated to correctly handle Cosmos SDK patterns:
- **Query service methods** are mapped to GET endpoints
- **Non-query methods** are excluded (they require signed transactions via `/cosmos/tx/v1beta1/txs`)
- **EVM modules** take priority over Cosmos SDK modules when there's overlap
- **No invalid POST methods** are generated for operations that require signed transactions

## Troubleshooting

### Connection Errors
```
Request failed: Connection refused
```
**Solution**: Ensure your node is running and accessible at the specified URL.

### Python Environment Issues
```
Python is not installed or not in PATH
```
**Solution**: Install Python 3.7+ and ensure it's in your PATH.

### Permission Errors
```
Permission denied
```
**Solution**: Make scripts executable: `chmod +x *.sh`

### Invalid Address Format
```
Invalid address format
```
**Solution**: Use proper address formats for your chain type.

### OpenAPI Generation Issues
```
Error parsing protobuf files
```
**Solution**: Run `./sync-protos.sh` first to ensure proto files are up to date.

## Development Workflow

### Typical Development Cycle
1. **Sync protobuf definitions**: `./sync-protos.sh`
2. **Generate OpenAPI specs**: `python3 generate-openapi-specs.py`
3. **Test APIs**: `./run_api_tests.sh`
4. **Discover new methods**: `python3 discover-jsonrpc-methods.py`
5. **Update documentation**: Commit generated files

### Adding New Tests
**For Cosmos REST API:**
```python
def test_new_module(self):
    """Test new module endpoints."""
    tests = [
        ("New Endpoint", "/cosmos/newmodule/v1beta1/endpoint", ["expected_key"]),
    ]

    for name, endpoint, expected_keys in tests:
        result = self.test_endpoint(name, endpoint, expected_keys)
        self.results.append(result)
        self.print_result(result)
```

**For EVM JSON-RPC:**
```python
def test_new_methods(self):
    """Test new EVM methods."""
    tests = [
        ("New Method", "eth_newMethod", ["param1", "param2"], str),
    ]

    for name, method, params, expected_type in tests:
        result = self.test_method(name, method, params, expected_type)
        # ... handle result
```

## Requirements

- **Bash** (for test runner and sync scripts)
- **Python 3.7+** (automatically managed via venv in test runner)
- **Git** (for proto syncing)
- **Running nodes** (for API testing):
  - Cosmos REST API (default: http://localhost:1317)
  - EVM JSON-RPC API (default: http://localhost:8545)

## CI/CD Integration

### Exit Codes
- `0` = All tests passed
- `1` = Some tests failed
- `>1` = Script/system error

### Example GitHub Action
```yaml
- name: Test APIs
  run: |
    chmod +x scripts/run_api_tests.sh
    ./scripts/run_api_tests.sh --rest-url ${{ secrets.REST_URL }} --evm-url ${{ secrets.EVM_URL }}

- name: Generate OpenAPI
  run: |
    ./scripts/sync-protos.sh
    python3 scripts/generate-openapi-specs.py
```

Perfect for automated testing and documentation generation pipelines!