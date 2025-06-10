#!/usr/bin/env python3
"""
Method Discovery Tool for Cosmos EVM JSON-RPC

This tool tests live RPC endpoints to discover which methods are actually supported
and generates accurate documentation based on real implementation.
"""

import requests
import json
import time
import logging
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor, as_completed
import argparse

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class MethodTest:
    """Test case for a JSON-RPC method"""
    method: str
    params: List[Any]
    description: str
    category: str
    expects_error: bool = False
    min_geth_version: str = "1.9.0"

class RPCMethodDiscovery:
    """Discover and test actual RPC method support"""

    def __init__(self, rpc_url: str, timeout: int = 10):
        self.rpc_url = rpc_url
        self.timeout = timeout
        self.supported_methods = {}
        self.unsupported_methods = {}

    def test_method(self, test: MethodTest) -> Tuple[str, bool, Optional[Dict], Optional[str]]:
        """Test a single RPC method"""
        payload = {
            "jsonrpc": "2.0",
            "method": test.method,
            "params": test.params,
            "id": 1
        }

        try:
            response = requests.post(
                self.rpc_url,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=self.timeout
            )

            if response.status_code == 200:
                result = response.json()

                # Check for JSON-RPC errors
                if 'error' in result:
                    error_code = result['error']['code']
                    error_message = result['error']['message']

                    # Method not found errors
                    if error_code == -32601:
                        return test.method, False, None, f"Method not found: {error_message}"

                    # Other errors might indicate the method exists but has invalid params
                    elif error_code == -32602:
                        return test.method, True, result, f"Method exists but invalid params: {error_message}"

                    # If we expect an error and got one, method exists
                    elif test.expects_error:
                        return test.method, True, result, f"Expected error received: {error_message}"

                    else:
                        return test.method, True, result, f"Method exists, error: {error_message}"

                # Successful response
                return test.method, True, result, "Success"

            else:
                return test.method, False, None, f"HTTP error: {response.status_code}"

        except requests.exceptions.Timeout:
            return test.method, False, None, "Request timeout"
        except requests.exceptions.ConnectionError:
            return test.method, False, None, "Connection error"
        except Exception as e:
            return test.method, False, None, f"Unexpected error: {str(e)}"

    def discover_methods(self, test_methods: List[MethodTest], max_workers: int = 10) -> Dict[str, Any]:
        """Discover supported methods by testing them"""
        logger.info(f"Testing {len(test_methods)} methods against {self.rpc_url}")

        results = {
            'supported': {},
            'unsupported': {},
            'errors': {},
            'summary': {
                'total_tested': len(test_methods),
                'supported_count': 0,
                'unsupported_count': 0,
                'error_count': 0
            }
        }

        # Test methods concurrently
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all tests
            future_to_test = {executor.submit(self.test_method, test): test for test in test_methods}

            # Collect results
            for future in as_completed(future_to_test):
                test = future_to_test[future]
                try:
                    method, supported, response, message = future.result()

                    if supported:
                        results['supported'][method] = {
                            'category': test.category,
                            'description': test.description,
                            'test_params': test.params,
                            'response_sample': response,
                            'message': message,
                            'min_geth_version': test.min_geth_version
                        }
                        results['summary']['supported_count'] += 1
                    else:
                        results['unsupported'][method] = {
                            'category': test.category,
                            'description': test.description,
                            'test_params': test.params,
                            'error_message': message,
                            'min_geth_version': test.min_geth_version
                        }
                        results['summary']['unsupported_count'] += 1

                    logger.info(f"✅ {method}: {'SUPPORTED' if supported else 'UNSUPPORTED'} - {message}")

                except Exception as exc:
                    method = future_to_test[future].method
                    results['errors'][method] = str(exc)
                    results['summary']['error_count'] += 1
                    logger.error(f"❌ {method}: ERROR - {exc}")

        return results

    def generate_compatibility_report(self, results: Dict[str, Any]) -> str:
        """Generate a markdown compatibility report"""
        report = []
        report.append("# Cosmos EVM JSON-RPC Compatibility Report")
        report.append(f"\nGenerated: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}")
        report.append(f"Tested against: {self.rpc_url}")
        report.append("")

        # Summary
        summary = results['summary']
        report.append("## Summary")
        report.append(f"- Total Methods Tested: {summary['total_tested']}")
        report.append(f"- Supported: {summary['supported_count']}")
        report.append(f"- Unsupported: {summary['unsupported_count']}")
        report.append(f"- Errors: {summary['error_count']}")
        report.append("")

        # Supported methods by category
        supported = results['supported']
        categories = {}
        for method, info in supported.items():
            cat = info['category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append((method, info))

        report.append("## Supported Methods")
        for category, methods in categories.items():
            report.append(f"\n### {category}")
            report.append("| Method | Description | Min Geth Version |")
            report.append("|--------|-------------|------------------|")
            for method, info in methods:
                desc = info['description'][:50] + "..." if len(info['description']) > 50 else info['description']
                report.append(f"| `{method}` | {desc} | {info['min_geth_version']} |")

        # Unsupported methods
        unsupported = results['unsupported']
        if unsupported:
            report.append("\n## Unsupported Methods")
            report.append("| Method | Expected Category | Reason |")
            report.append("|--------|------------------|--------|")
            for method, info in unsupported.items():
                report.append(f"| `{method}` | {info['category']} | {info['error_message']} |")

        return "\n".join(report)

def get_standard_test_methods() -> List[MethodTest]:
    """Get standard Ethereum JSON-RPC methods to test"""
    return [
        # Core ETH methods
        MethodTest("eth_chainId", [], "Get chain ID", "Network"),
        MethodTest("eth_blockNumber", [], "Get latest block number", "Block"),
        MethodTest("eth_gasPrice", [], "Get current gas price", "Fee"),
        MethodTest("eth_getBalance", ["0x0000000000000000000000000000000000000000", "latest"], "Get account balance", "Account"),
        MethodTest("eth_getTransactionCount", ["0x0000000000000000000000000000000000000000", "latest"], "Get transaction count", "Account"),
        MethodTest("eth_getCode", ["0x0000000000000000000000000000000000000000", "latest"], "Get contract code", "Account"),
        MethodTest("eth_getStorageAt", ["0x0000000000000000000000000000000000000000", "0x0", "latest"], "Get storage value", "Account"),

        # Block methods
        MethodTest("eth_getBlockByNumber", ["latest", False], "Get block by number", "Block"),
        MethodTest("eth_getBlockByHash", ["0x0000000000000000000000000000000000000000000000000000000000000000", False], "Get block by hash", "Block", expects_error=True),
        MethodTest("eth_getBlockTransactionCountByNumber", ["latest"], "Get block transaction count by number", "Block"),

        # Transaction methods
        MethodTest("eth_call", [{"to": "0x0000000000000000000000000000000000000000", "data": "0x"}, "latest"], "Execute call", "Transaction"),
        MethodTest("eth_estimateGas", [{"to": "0x0000000000000000000000000000000000000000"}], "Estimate gas", "Transaction"),
        MethodTest("eth_getTransactionByHash", ["0x0000000000000000000000000000000000000000000000000000000000000000"], "Get transaction by hash", "Transaction", expects_error=True),
        MethodTest("eth_getTransactionReceipt", ["0x0000000000000000000000000000000000000000000000000000000000000000"], "Get transaction receipt", "Transaction", expects_error=True),

        # EIP-1559 methods
        MethodTest("eth_feeHistory", [4, "latest", [25, 50, 75]], "Get fee history", "Fee", min_geth_version="1.10.0"),
        MethodTest("eth_maxPriorityFeePerGas", [], "Get max priority fee per gas", "Fee", min_geth_version="1.10.0"),

        # Filter methods
        MethodTest("eth_newFilter", [{"fromBlock": "latest", "toBlock": "latest"}], "Create new filter", "Filter"),
        MethodTest("eth_newBlockFilter", [], "Create new block filter", "Filter"),
        MethodTest("eth_getLogs", [{"fromBlock": "latest", "toBlock": "latest"}], "Get logs", "Filter"),

        # Net methods
        MethodTest("net_version", [], "Get network version", "Network"),
        MethodTest("net_listening", [], "Check if listening", "Network"),
        MethodTest("net_peerCount", [], "Get peer count", "Network"),

        # Web3 methods
        MethodTest("web3_clientVersion", [], "Get client version", "Web3"),
        MethodTest("web3_sha3", ["0x68656c6c6f20776f726c64"], "Calculate sha3", "Web3"),

        # Debug methods (may not be available on all nodes)
        MethodTest("debug_traceTransaction", ["0x0000000000000000000000000000000000000000000000000000000000000000"], "Trace transaction", "Debug", expects_error=True, min_geth_version="1.9.0"),

        # Txpool methods
        MethodTest("txpool_status", [], "Get txpool status", "TxPool"),
        MethodTest("txpool_content", [], "Get txpool content", "TxPool"),

        # Newer methods that might not be supported
        MethodTest("eth_createAccessList", [{"to": "0x0000000000000000000000000000000000000000"}, "latest"], "Create access list", "Transaction", min_geth_version="1.10.0"),
        MethodTest("eth_getProof", ["0x0000000000000000000000000000000000000000", [], "latest"], "Get account proof", "Account", min_geth_version="1.10.0"),
    ]

def main():
    parser = argparse.ArgumentParser(description="Discover supported JSON-RPC methods")
    parser.add_argument("--rpc-url", default="http://localhost:8545", help="RPC URL to test")
    parser.add_argument("--output", default="compatibility_report.md", help="Output file for report")
    parser.add_argument("--json-output", default="method_discovery.json", help="JSON output file")
    parser.add_argument("--timeout", type=int, default=10, help="Request timeout in seconds")
    parser.add_argument("--workers", type=int, default=10, help="Number of concurrent workers")

    args = parser.parse_args()

    # Create discovery instance
    discovery = RPCMethodDiscovery(args.rpc_url, args.timeout)

    # Get test methods
    test_methods = get_standard_test_methods()

    # Discover methods
    results = discovery.discover_methods(test_methods, args.workers)

    # Generate report
    report = discovery.generate_compatibility_report(results)

    # Write outputs
    with open(args.output, 'w') as f:
        f.write(report)

    with open(args.json_output, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"\nDiscovery complete!")
    print(f"Report written to: {args.output}")
    print(f"JSON data written to: {args.json_output}")
    print(f"Supported methods: {results['summary']['supported_count']}/{results['summary']['total_tested']}")

if __name__ == "__main__":
    main()