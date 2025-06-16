# Precompiles Documentation Test Suite

This directory contains a comprehensive test suite for validating all precompiles documentation examples.

## Files

- `test-precompiles.js` - Main test script
- `package.json` - Node.js dependencies
- `ISSUES_FOUND.md` - Documented issues found during audit
- `README.md` - This file

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Test Parameters**
   Edit the `CONFIG` section in `test-precompiles.js`:
   ```javascript
   const CONFIG = {
     RPC_URL: "http://localhost:8545", // Your RPC endpoint
     PRIVATE_KEY: "0x...", // Test private key
     TEST_ACCOUNT: "0x...", // Derived address
     // ... other settings
   };
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

## Configuration

### Required Settings

- **RPC_URL**: Your blockchain RPC endpoint
- **PRIVATE_KEY**: Test account private key (for transaction tests)
- **TEST_ACCOUNT**: Ethereum address derived from private key
- **TEST_VALIDATOR**: Valid validator address for staking tests
- **TEST_BECH32**: Valid bech32 address for address conversion tests

### Test Parameters

- **TIMEOUT_MS**: Timeout for each test (default: 10 seconds)
- **MAX_RETRIES**: Number of retries for failed tests (default: 3)

## Test Coverage

The test suite validates:

### Query Method Examples
- ✅ Bank: `balances`, `totalSupply`, `supplyOf`
- ✅ Bech32: `hexToBech32`, `bech32ToHex`  
- ✅ Distribution: `delegationTotalRewards`, `communityPool`
- ✅ Governance: `getProposal`, `getParams`
- ✅ ICS20: `denom`, `denomHash`
- ✅ P256: `getGenerator`, `isOnCurve`
- ✅ Slashing: `getSigningInfo`, `getParams`
- ✅ Staking: `validator`, `pool`, `params`
- ✅ Evidence: `evidence` (basic test)

### Test Methods
For each function, the suite tests:
- **Ethers.js**: JavaScript SDK integration
- **cURL**: Raw RPC calls with proper ABI encoding

## Test Output

```
Starting Precompiles Test Suite...

Configuration:
  RPC URL: http://localhost:8545
  Test Account: 0x7E5F4552091A69125d5DfCb7b8C2659029395Bdf

Running tests...

[PASS] Bank.balances (ethers)
[PASS] Bank.balances (curl)
[PASS] Bank.totalSupply (ethers)
[FAIL] Bank.totalSupply (curl)
  Error: execution reverted

================================================================================
PRECOMPILES TEST REPORT
================================================================================

SUMMARY:
  Total Tests: 36
  Passed: 32
  Failed: 4
  Skipped: 0

FAILED TESTS:
  - Bank.totalSupply (curl): execution reverted
  - P256.verifySignature (ethers): missing required parameter
```

## Known Issues

See `ISSUES_FOUND.md` for a detailed list of documentation issues discovered during testing.

## Contributing

When updating precompiles documentation:

1. Add test cases to `test-precompiles.js` for new functions
2. Run the test suite to validate examples
3. Update `ISSUES_FOUND.md` with any new issues
4. Ensure both ethers.js and curl examples are provided

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check RPC_URL is correct and accessible
2. **Transaction Failures**: Ensure test account has sufficient funds
3. **Function Not Found**: Verify precompile address and ABI are correct
4. **Timeout Errors**: Increase TIMEOUT_MS for slow networks

### Debug Mode

Run with verbose logging:
```bash
DEBUG=1 node test-precompiles.js
```