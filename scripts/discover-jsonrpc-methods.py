#!/usr/bin/env python3
"""
Discover EVM JSON-RPC Methods from Running RPC and Codebase

This script discovers all available EVM JSON-RPC methods by:
1. Querying a running EVM RPC endpoint for supported methods
2. Analyzing the cosmos/evm codebase for method definitions
3. Generating interactive Mintlify documentation pages
"""

import os
import re
import json
import yaml # type: ignore
import requests
import tempfile
import subprocess
from pathlib import Path
from typing import Dict, List, Set, Any, Optional
import argparse

# Standard Ethereum JSON-RPC methods with descriptions
STANDARD_ETH_METHODS = {
    # Account Methods
    "eth_accounts": {
        "description": "Returns a list of addresses owned by client",
        "params": [],
        "returns": "Array of addresses"
    },
    "eth_getBalance": {
        "description": "Returns the balance of the account of given address",
        "params": ["address", "block_number"],
        "returns": "Balance in wei"
    },
    "eth_getCode": {
        "description": "Returns code at a given address",
        "params": ["address", "block_number"],
        "returns": "Contract bytecode"
    },
    "eth_getStorageAt": {
        "description": "Returns the value from a storage position at a given address",
        "params": ["address", "position", "block_number"],
        "returns": "Storage value"
    },
    "eth_getTransactionCount": {
        "description": "Returns the number of transactions sent from an address",
        "params": ["address", "block_number"],
        "returns": "Transaction count (nonce)"
    },

    # Block Methods
    "eth_blockNumber": {
        "description": "Returns the number of most recent block",
        "params": [],
        "returns": "Block number"
    },
    "eth_getBlockByHash": {
        "description": "Returns information about a block by hash",
        "params": ["block_hash", "full_transactions"],
        "returns": "Block object"
    },
    "eth_getBlockByNumber": {
        "description": "Returns information about a block by number",
        "params": ["block_number", "full_transactions"],
        "returns": "Block object"
    },
    "eth_getBlockTransactionCountByHash": {
        "description": "Returns the number of transactions in a block by hash",
        "params": ["block_hash"],
        "returns": "Transaction count"
    },
    "eth_getBlockTransactionCountByNumber": {
        "description": "Returns the number of transactions in a block by number",
        "params": ["block_number"],
        "returns": "Transaction count"
    },

    # Transaction Methods
    "eth_sendTransaction": {
        "description": "Creates new message call transaction or a contract creation",
        "params": ["transaction"],
        "returns": "Transaction hash"
    },
    "eth_sendRawTransaction": {
        "description": "Submits a pre-signed transaction for broadcast",
        "params": ["signed_transaction_data"],
        "returns": "Transaction hash"
    },
    "eth_getTransactionByHash": {
        "description": "Returns the information about a transaction by hash",
        "params": ["transaction_hash"],
        "returns": "Transaction object"
    },
    "eth_getTransactionByBlockHashAndIndex": {
        "description": "Returns transaction by block hash and index",
        "params": ["block_hash", "index"],
        "returns": "Transaction object"
    },
    "eth_getTransactionByBlockNumberAndIndex": {
        "description": "Returns transaction by block number and index",
        "params": ["block_number", "index"],
        "returns": "Transaction object"
    },
    "eth_getTransactionReceipt": {
        "description": "Returns the receipt of a transaction by hash",
        "params": ["transaction_hash"],
        "returns": "Transaction receipt"
    },
    "eth_pendingTransactions": {
        "description": "Returns pending transactions",
        "params": [],
        "returns": "Array of pending transactions"
    },

    # Gas and Fee Methods
    "eth_gasPrice": {
        "description": "Returns the current price per gas in wei",
        "params": [],
        "returns": "Gas price in wei"
    },
    "eth_maxPriorityFeePerGas": {
        "description": "Returns the current maxPriorityFeePerGas per gas in wei",
        "params": [],
        "returns": "Max priority fee per gas"
    },
    "eth_feeHistory": {
        "description": "Returns fee history",
        "params": ["block_count", "newest_block", "reward_percentiles"],
        "returns": "Fee history object"
    },
    "eth_estimateGas": {
        "description": "Generates and returns an estimate of how much gas is necessary",
        "params": ["transaction"],
        "returns": "Gas estimate"
    },

    # Call and Simulation
    "eth_call": {
        "description": "Executes a new message call immediately without creating a transaction",
        "params": ["transaction", "block_number"],
        "returns": "Call result"
    },
    "eth_chainId": {
        "description": "Returns the chain ID of the current network",
        "params": [],
        "returns": "Chain ID"
    },

    # Filter and Event Methods
    "eth_newFilter": {
        "description": "Creates a filter object for logs",
        "params": ["filter_object"],
        "returns": "Filter ID"
    },
    "eth_newBlockFilter": {
        "description": "Creates a filter for new blocks",
        "params": [],
        "returns": "Filter ID"
    },
    "eth_newPendingTransactionFilter": {
        "description": "Creates a filter for pending transactions",
        "params": [],
        "returns": "Filter ID"
    },
    "eth_getFilterChanges": {
        "description": "Returns changes since last poll for a filter",
        "params": ["filter_id"],
        "returns": "Array of changes"
    },
    "eth_getFilterLogs": {
        "description": "Returns all logs matching filter",
        "params": ["filter_id"],
        "returns": "Array of logs"
    },
    "eth_getLogs": {
        "description": "Returns logs matching given filter object",
        "params": ["filter_object"],
        "returns": "Array of logs"
    },
    "eth_uninstallFilter": {
        "description": "Uninstalls a filter with given id",
        "params": ["filter_id"],
        "returns": "Success boolean"
    },

    # Subscription Methods (WebSocket)
    "eth_subscribe": {
        "description": "Subscribe to particular events via WebSocket",
        "params": ["subscription_type", "params"],
        "returns": "Subscription ID"
    },
    "eth_unsubscribe": {
        "description": "Unsubscribe from particular subscription",
        "params": ["subscription_id"],
        "returns": "Success boolean"
    },

    # Network Methods
    "net_version": {
        "description": "Returns the current network id",
        "params": [],
        "returns": "Network ID"
    },
    "net_listening": {
        "description": "Returns true if client is actively listening for network connections",
        "params": [],
        "returns": "Listening boolean"
    },
    "net_peerCount": {
        "description": "Returns number of peers currently connected to the client",
        "params": [],
        "returns": "Peer count"
    },

    # Web3 Methods
    "web3_clientVersion": {
        "description": "Returns the current client version",
        "params": [],
        "returns": "Client version"
    },
    "web3_sha3": {
        "description": "Returns Keccak-256 (not the standardized SHA3-256) of the given data",
        "params": ["data"],
        "returns": "Hash"
    },

    # Debug Methods (optional, may not be available on all nodes)
    "debug_traceTransaction": {
        "description": "Returns transaction trace",
        "params": ["transaction_hash", "trace_options"],
        "returns": "Trace object"
    },
    "debug_traceBlockByNumber": {
        "description": "Returns block trace by number",
        "params": ["block_number", "trace_options"],
        "returns": "Trace object"
    },

    # TxPool Methods (optional)
    "txpool_status": {
        "description": "Returns transaction pool status",
        "params": [],
        "returns": "TxPool status"
    },
    "txpool_content": {
        "description": "Returns transaction pool content",
        "params": [],
        "returns": "TxPool content"
    }
}

def test_rpc_endpoint(rpc_url: str) -> bool:
    """Test if RPC endpoint is accessible"""
    try:
        response = requests.post(rpc_url, json={
            "jsonrpc": "2.0",
            "method": "eth_chainId",
            "params": [],
            "id": 1
        }, timeout=5)
        return response.status_code == 200
    except:
        return False

def discover_methods_from_rpc(rpc_url: str) -> Set[str]:
    """Discover available methods by testing a running RPC endpoint"""
    print(f"🔍 Testing RPC endpoint: {rpc_url}")

    if not test_rpc_endpoint(rpc_url):
        print(f"❌ RPC endpoint not accessible: {rpc_url}")
        return set()

    print(f"✅ RPC endpoint accessible, testing methods...")
    available_methods = set()

    # Test each standard method
    for method_name in STANDARD_ETH_METHODS.keys():
        try:
            # Use minimal params for testing
            test_params = []
            if method_name in ["eth_getBalance", "eth_getCode", "eth_getStorageAt", "eth_getTransactionCount"]:
                test_params = ["0x0000000000000000000000000000000000000000", "latest"]
            elif method_name in ["eth_getBlockByHash", "eth_getBlockTransactionCountByHash"]:
                test_params = ["0x0000000000000000000000000000000000000000000000000000000000000000", False]
            elif method_name in ["eth_getBlockByNumber", "eth_getBlockTransactionCountByNumber"]:
                test_params = ["latest", False]
            elif method_name == "eth_getStorageAt":
                test_params = ["0x0000000000000000000000000000000000000000", "0x0", "latest"]

            response = requests.post(rpc_url, json={
                "jsonrpc": "2.0",
                "method": method_name,
                "params": test_params,
                "id": 1
            }, timeout=3)

            if response.status_code == 200:
                data = response.json()
                # Method is supported if we don't get "method not found" error
                if "error" not in data or data["error"]["code"] != -32601:
                    available_methods.add(method_name)
                    print(f"  ✅ {method_name}")
                else:
                    print(f"  ❌ {method_name} - not supported")

        except Exception as e:
            print(f"  ⚠️  {method_name} - test failed: {e}")

    return available_methods

def clone_cosmos_evm_repo(target_dir: str, branch: str = "main") -> bool:
    """Clone the cosmos/evm repository to analyze source code"""
    repo_url = "https://github.com/cosmos/evm.git"

    try:
        print(f"📥 Cloning cosmos/evm repository...")
        subprocess.run([
            "git", "clone", "--depth", "1", "--branch", branch, repo_url, target_dir
        ], check=True, capture_output=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to clone repository: {e}")
        return False

def discover_methods_from_source(repo_dir: str) -> Set[str]:
    """Discover methods from source code analysis"""
    print("🔍 Analyzing source code for JSON-RPC methods...")

    methods = set()
    repo_path = Path(repo_dir)

    # Search for Go files that might contain RPC method definitions
    patterns = [
        r'func\s+\([^)]*\)\s+(eth_[a-zA-Z0-9_]+)',
        r'func\s+\([^)]*\)\s+(net_[a-zA-Z0-9_]+)',
        r'func\s+\([^)]*\)\s+(web3_[a-zA-Z0-9_]+)',
        r'func\s+\([^)]*\)\s+(debug_[a-zA-Z0-9_]+)',
        r'func\s+\([^)]*\)\s+(txpool_[a-zA-Z0-9_]+)',
        r'"(eth_[a-zA-Z0-9_]+)"',
        r'"(net_[a-zA-Z0-9_]+)"',
        r'"(web3_[a-zA-Z0-9_]+)"',
    ]

    for go_file in repo_path.glob("**/*.go"):
        try:
            content = go_file.read_text()
            for pattern in patterns:
                matches = re.finditer(pattern, content)
                for match in matches:
                    method_name = match.group(1)
                    if any(method_name.startswith(prefix) for prefix in ['eth_', 'net_', 'web3_', 'debug_', 'txpool_']):
                        methods.add(method_name)
                        print(f"  📄 Found {method_name} in {go_file.relative_to(repo_path)}")
        except Exception as e:
            continue

    return methods

def generate_method_page(method_name: str, method_info: Dict[str, Any], output_dir: Path) -> None:
    """Generate an individual method documentation page"""

    # Determine category
    category = method_name.split('_')[0] if '_' in method_name else 'unknown'
    category_dir = output_dir / category
    category_dir.mkdir(exist_ok=True)

    # Generate example parameters
    example_params = []
    if method_info.get("params"):
        param_examples = {
            "address": "0x742d35cc6644c068532fddb11B4C36A58D6D3eAb",
            "block_number": "latest",
            "block_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            "transaction_hash": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            "transaction": {
                "to": "0x742d35cc6644c068532fddb11B4C36A58D6D3eAb",
                "value": "0x1000000000000000000",
                "gas": "0x5208"
            },
            "full_transactions": "false",
            "index": "0x0",
            "position": "0x0",
            "signed_transaction_data": "0x...",
            "filter_object": {
                "fromBlock": "latest",
                "toBlock": "latest",
                "address": "0x742d35cc6644c068532fddb11B4C36A58D6D3eAb"
            },
            "filter_id": "0x1",
            "subscription_type": "newHeads",
            "subscription_id": "0x1",
            "data": "0x68656c6c6f20776f726c64",
            "trace_options": {},
            "reward_percentiles": [25, 50, 75],
            "block_count": "0x4",
            "newest_block": "latest"
        }

        for param in method_info["params"]:
            if param in param_examples:
                example_params.append(param_examples[param])
            else:
                example_params.append(f"<{param}>")

    # Create page content
    content = f'''---
title: "{method_name}"
description: "{method_info['description']}"
---

## Overview

{method_info['description']}

### Parameters

'''

    if method_info.get("params"):
        for i, param in enumerate(method_info["params"]):
            content += f"{i+1}. `{param}` - Parameter description\n"
    else:
        content += "This method takes no parameters.\n"

    content += f'''
### Returns

{method_info.get('returns', 'Method return value')}

## Examples

### Request

<CodeGroup>
```bash cURL
curl -X POST https://evm-rpc.cosmos.network \\
  -H "Content-Type: application/json" \\
  -d '{{
    "jsonrpc": "2.0",
    "method": "{method_name}",
    "params": {json.dumps(example_params)},
    "id": 1
  }}'
```

```javascript JavaScript (Web3.js)
const Web3 = require('web3');
const web3 = new Web3('https://evm-rpc.cosmos.network');

// Example call
const result = await web3.eth.{method_name.replace('eth_', '')}({', '.join([str(p) for p in example_params])});
console.log(result);
```

```javascript JavaScript (Ethers.js)
const {{ ethers }} = require('ethers');
const provider = new ethers.providers.JsonRpcProvider('https://evm-rpc.cosmos.network');

// Example call
const result = await provider.send('{method_name}', {json.dumps(example_params)});
console.log(result);
```

```python Python (Web3.py)
from web3 import Web3

w3 = Web3(Web3.HTTPProvider('https://evm-rpc.cosmos.network'))

// Example call
result = w3.manager.request_blocking('{method_name}', {example_params})
print(result)
```
</CodeGroup>

### Response

```json
{{
  "jsonrpc": "2.0",
  "id": 1,
  "result": "// Method-specific result"
}}
```

### Error Response

```json
{{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {{
    "code": -32600,
    "message": "Invalid Request"
  }}
}}
```

## Notes

- This method is compatible with the Ethereum JSON-RPC specification
- Available on both mainnet and testnet endpoints
- Rate limits may apply on public endpoints

## Related Methods

'''

    # Add related methods from same category
    related_methods = [m for m in STANDARD_ETH_METHODS.keys() if m.startswith(category + '_') and m != method_name]
    if related_methods:
        for related in related_methods[:3]:  # Show max 3 related methods
            content += f"- [`{related}`](./{related})\n"

    content += '''
## See Also

- [Complete JSON-RPC API Reference](../index)
- [EVM Development Guide](/docs/evm/developers)
- [Network Configuration](/docs/evm/developers/local-setup)
'''

    # Write the file
    file_path = category_dir / f"{method_name}.mdx"
    file_path.write_text(content)
    print(f"  📄 Generated {file_path}")

def main():
    parser = argparse.ArgumentParser(description="Discover and document EVM JSON-RPC methods")
    parser.add_argument("--rpc-url", default="http://localhost:8545",
                       help="RPC endpoint to test (default: http://localhost:8545)")
    parser.add_argument("--output-dir", default="docs/api-reference/evm-jsonrpc",
                       help="Output directory for documentation")
    parser.add_argument("--branch", default="main",
                       help="Branch to clone from cosmos/evm repository")
    parser.add_argument("--skip-rpc-test", action="store_true",
                       help="Skip testing RPC endpoint, use all standard methods")

    args = parser.parse_args()

    print("🔍 Discovering EVM JSON-RPC methods...")

    # Discover methods from RPC endpoint
    available_methods = set()
    if not args.skip_rpc_test:
        available_methods = discover_methods_from_rpc(args.rpc_url)

    # Discover methods from source code
    with tempfile.TemporaryDirectory() as temp_dir:
        repo_dir = os.path.join(temp_dir, "cosmos-evm")
        if clone_cosmos_evm_repo(repo_dir, args.branch):
            source_methods = discover_methods_from_source(repo_dir)
            available_methods.update(source_methods)

    # If no methods discovered, use all standard methods
    if not available_methods:
        print("⚠️  No methods discovered, using all standard Ethereum methods")
        available_methods = set(STANDARD_ETH_METHODS.keys())

    print(f"✅ Found {len(available_methods)} available methods")

    # Create output directory
    output_path = Path(args.output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Generate method pages
    print("📝 Generating method documentation pages...")

    navigation_groups = {}
    for method_name in sorted(available_methods):
        if method_name in STANDARD_ETH_METHODS:
            method_info = STANDARD_ETH_METHODS[method_name]
            generate_method_page(method_name, method_info, output_path)

            # Group by category for navigation
            category = method_name.split('_')[0]
            if category not in navigation_groups:
                navigation_groups[category] = []
            navigation_groups[category].append(f"docs/api-reference/evm-jsonrpc/{category}/{method_name}")

    # Print navigation suggestion
    print(f"\n✅ Generated {len(available_methods)} method documentation pages")
    print("\n📝 Navigation structure for docs.json:")
    print(json.dumps([
        {
            "group": cat.title(),
            "isCollapsible": True,
            "pages": pages
        }
        for cat, pages in navigation_groups.items()
    ], indent=2))

if __name__ == "__main__":
    main()