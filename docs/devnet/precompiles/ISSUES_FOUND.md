# Precompiles Documentation Issues Found

## Critical Issues Requiring Fixes

### 1. Bank Precompile - Incorrect Function Selector
**File**: `bank.mdx` (Line 176)
**Issue**: The `supplyOf` function curl example uses incorrect function selector
**Current**: `0x38433b36` (which is for delegationRewards)
**Required**: Calculate correct function selector for `supplyOf(address)` 
**Impact**: curl example will fail when tested

### 2. P256 Precompile - Incomplete curl Examples  
**File**: `p256.mdx` (Lines 84, 187)
**Issue**: Placeholder data in curl examples
**Current**: `"data": "0x12345678..."` 
**Required**: Complete function call encoding
**Impact**: curl examples are non-functional

### 3. Evidence Precompile - Incomplete curl Example
**File**: `evidence.mdx` (Line 59)
**Issue**: Incomplete data encoding for evidence query
**Current**: Appears truncated
**Required**: Complete ABI encoding for evidence hash parameter
**Impact**: curl example may fail

### 4. Bech32 Interface Definition
**File**: `bech32.mdx` (Lines 156-157)  
**Issue**: Function mutability incorrectly specified
**Current**: `external returns` 
**Expected**: `external view returns` for view functions
**Impact**: Interface definition inconsistency

## Missing Transaction Method Examples

### Distribution Precompile
**Missing**: 
- `claimRewards` - ethers.js and curl examples
- `withdrawDelegatorRewards` - ethers.js and curl examples  
- `setWithdrawAddress` - ethers.js and curl examples
- `withdrawValidatorCommission` - ethers.js and curl examples
- `fundCommunityPool` - ethers.js and curl examples

### Evidence Precompile
**Missing**:
- `submitEvidence` - ethers.js and curl examples

### Governance Precompile  
**Missing**:
- `submitProposal` - ethers.js and curl examples
- `vote` - ethers.js and curl examples
- `voteWeighted` - ethers.js and curl examples
- `deposit` - ethers.js and curl examples
- `cancelProposal` - ethers.js and curl examples

### ICS20 Precompile
**Missing**:
- `transfer` - ethers.js and curl examples (main transaction method)

### Slashing Precompile
**Missing**:
- `unjail` - ethers.js and curl examples

### Staking Precompile
**Missing**:
- `createValidator` - ethers.js and curl examples
- `editValidator` - ethers.js and curl examples  
- `delegate` - ethers.js and curl examples
- `undelegate` - ethers.js and curl examples
- `redelegate` - ethers.js and curl examples
- `cancelUnbondingDelegation` - ethers.js and curl examples

### WERC20 Precompile
**Missing**:
- `deposit` - ethers.js and curl examples
- `withdraw` - ethers.js and curl examples

## Recommendations

1. **Calculate Correct Function Selectors**: Use `ethers.id(functionSignature).slice(0, 10)` to calculate proper 4-byte function selectors

2. **Add Transaction Examples**: Every precompile should include working examples for both query AND transaction methods

3. **Test All Examples**: Use the provided test script to verify all examples work correctly

4. **Standardize Format**: Ensure all precompiles follow the same documentation structure:
   - Overview with precompile address
   - Transaction Methods section (if applicable)  
   - Query Methods section
   - Full Interface & ABI section

5. **Parameter Validation**: Ensure all placeholder values are clearly marked and realistic

## Test Script Usage

Run the comprehensive test script to validate all examples:

```bash
cd /docs/devnet/precompiles
npm install
node test-precompiles.js
```

Configure the script by updating the CONFIG section with your environment details.