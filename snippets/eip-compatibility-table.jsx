export default function EIPCompatibilityTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [criticalityFilter, setCriticalityFilter] = useState('all');

  const eipData = [
    { eip: 7702, title: "Set Code for EOAs", status: "not_supported", critical: true, geth: "Activated", cosmos: "Not implemented", triage: "Red", note: "We will support that fully in v0.5.0", priority: 1 },
    { eip: 155, title: "Simple replay attack protection", status: "partial", critical: true, geth: "Configurable", cosmos: "Enforced through chain-wide params", triage: "Red", note: "Currently enforcing as chain-wide params, plan for making it similar with Geth", priority: 2, issue: "401" },
    { eip: 2681, title: "Limit account nonce to 2^64-1", status: "partial", critical: true, geth: "Activated", cosmos: "Missing strict overflow check at Antehandler", triage: "Red", note: "Need to update check logic more strictly", priority: 2, issue: "400" },
    { eip: 7623, title: "Increase calldata cost", status: "not_supported", critical: false, geth: "Activated", cosmos: "Not implemented", triage: "Red", note: "Not critical, no direct impact on users/devs", priority: 3 },
    { eip: 4844, title: "Shard Blob Transactions", status: "not_supported", critical: false, geth: "Activated", cosmos: "Not implemented", triage: "Blue", note: "Related to Layer 2 scaling", priority: 4 },
    { eip: 4788, title: "Beacon block root in the EVM", status: "not_supported", critical: false, geth: "Activated", cosmos: "Not implemented", triage: "Blue", note: "Not critical for Cosmos EVM", priority: 4, issue: "404" },
    { eip: 2935, title: "Serve historical block hashes from state", status: "not_supported", critical: false, geth: "Activated", cosmos: "Not implemented", triage: "Blue", note: "Mainly for stateless clients, rollups, zk", priority: 4 },
    { eip: 4399, title: "Supplant DIFFICULTY opcode with PREVRANDAO", status: "not_supported", critical: false, geth: "Activated", cosmos: "Not implemented", triage: "Blue", note: "Not critical for Cosmos consensus", priority: 4 },
    { eip: 7691, title: "Blob throughput increase", status: "not_applicable", critical: false, geth: "Activated", cosmos: "Not applicable (no blobTx)", triage: "Blue", note: "We don't have blob transactions", priority: 5 },
    { eip: 1559, title: "Fee market change (EIP-1559)", status: "supported", critical: true, geth: "Activated", cosmos: "Implemented via feemarket module (configurable)", triage: "Blue", note: "Can configure baseFee param, distributed to validators instead of burned", priority: 6 },
    { eip: 3651, title: "Warm COINBASE", status: "partial", critical: false, geth: "Activated", cosmos: "Implemented but always empty address", triage: "Blue", note: "Always empty address currently", priority: 7 },
    { eip: 6780, title: "SELFDESTRUCT only in same transaction", status: "partial", critical: false, geth: "Activated", cosmos: "Implemented with different handling details", triage: "Blue", note: "No direct impacts on users/devs", priority: 7 },
    { eip: 161, title: "State trie clearing", status: "supported", critical: false, geth: "Activated", cosmos: "No journaling for empty accounts", triage: "Blue", note: "Little difference but not critical", priority: 8 },
    { eip: 158, title: "State clearing", status: "supported", critical: false, geth: "Activated", cosmos: "Implemented in StateDB.Finalise", triage: "", note: "Little difference but not critical", priority: 8 },
    { eip: 2, title: "Homestead Hard-fork Changes", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 7, title: "DELEGATECALL", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 140, title: "REVERT instruction", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 141, title: "Designated invalid EVM instruction", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 145, title: "Bitwise shifting instructions", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 150, title: "Gas cost changes for IO-heavy operations", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 152, title: "BLAKE2 compression function precompile", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 160, title: "EXP cost increase", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 170, title: "Contract code size limit", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 196, title: "Elliptic curve alt_bn128 operations", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 197, title: "Elliptic curve alt_bn128 pairing", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 198, title: "Big integer modular exponentiation", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 211, title: "RETURNDATASIZE and RETURNDATACOPY", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 214, title: "STATICCALL opcode", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 658, title: "Transaction status in receipts", status: "supported", critical: true, geth: "Activated", cosmos: "Implemented", triage: "", note: "Already have it", priority: 9 },
    { eip: 684, title: "Revert creation on collision", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 1014, title: "CREATE2", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 1052, title: "EXTCODEHASH opcode", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 1108, title: "Reduce alt_bn128 gas costs", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 1153, title: "Transient storage opcodes", status: "supported", critical: true, geth: "Activated", cosmos: "Implemented TransientStorage", triage: "", note: "Already have it", priority: 9 },
    { eip: 1283, title: "Net gas metering for SSTORE", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 1344, title: "ChainID opcode", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 1884, title: "Repricing trie-size-dependent opcodes", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 2028, title: "Transaction data gas cost reduction", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 2200, title: "Net Gas Metering", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 2537, title: "BLS12-381 curve operations", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 2565, title: "ModExp Gas Cost", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 2718, title: "Typed Transaction Envelope", status: "supported", critical: true, geth: "Activated", cosmos: "Using Geth's Transaction Marshaling", triage: "", note: "Already have it", priority: 9 },
    { eip: 2929, title: "Gas cost increases for state access", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 2930, title: "Optional access lists", status: "supported", critical: true, geth: "Activated", cosmos: "Implemented AccessList", triage: "", note: "Already have it", priority: 9 },
    { eip: 3198, title: "BASEFEE opcode", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 3529, title: "Reduction in refunds", status: "supported", critical: true, geth: "Activated", cosmos: "Implemented in ApplyMessageWithConfig", triage: "", note: "Already have it", priority: 9 },
    { eip: 3541, title: "Reject 0xEF bytecode", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 3607, title: "Reject transactions from code", status: "supported", critical: true, geth: "Activated", cosmos: "Implemented in VerifyAccountBalance", triage: "", note: "Already have it", priority: 9 },
    { eip: 3855, title: "PUSH0 instruction", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 3860, title: "Limit and meter initcode", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 5656, title: "MCOPY - Memory copying", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 7516, title: "BLOBBASEFEE instruction", status: "supported", critical: true, geth: "Activated", cosmos: "Enforced via Geth EVM", triage: "", note: "Already have it", priority: 9 },
    { eip: 5, title: "Gas Usage for RETURN and CALL", status: "not_applicable", critical: false, geth: "Not Implemented", cosmos: "N/A (inherits Geth)", triage: "", note: "Geth doesn't have this", priority: 10 },
    { eip: 100, title: "Difficulty adjustment", status: "not_applicable", critical: false, geth: "Not applicable (PoS)", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 225, title: "Clique proof-of-authority", status: "not_applicable", critical: false, geth: "Configurable", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 649, title: "Metropolis Difficulty Bomb", status: "not_applicable", critical: false, geth: "Legacy", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 1234, title: "Constantinople Difficulty Bomb", status: "not_applicable", critical: false, geth: "Legacy", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 2384, title: "Muir Glacier Difficulty Bomb", status: "not_applicable", critical: false, geth: "Legacy", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 3554, title: "Difficulty Bomb Delay 2021", status: "not_applicable", critical: false, geth: "Legacy", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 3675, title: "Upgrade to Proof-of-Stake", status: "not_applicable", critical: false, geth: "Legacy", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 4345, title: "Difficulty Bomb Delay 2022", status: "not_applicable", critical: false, geth: "Legacy", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 4895, title: "Beacon chain withdrawals", status: "not_applicable", critical: false, geth: "Activated", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 5133, title: "Difficulty Bomb Delay Sept 2022", status: "not_applicable", critical: false, geth: "Legacy", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 6110, title: "Supply validator deposits", status: "not_applicable", critical: false, geth: "Activated", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 6916, title: "Automatically Reset Testnet", status: "not_applicable", critical: false, geth: "Activated", cosmos: "Not applicable", triage: "", note: "Not applicable", priority: 10 },
    { eip: 7002, title: "Execution layer withdrawals", status: "not_applicable", critical: false, geth: "", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 7044, title: "Perpetually Valid Exits", status: "not_applicable", critical: false, geth: "", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 7045, title: "Increase attestation slot", status: "not_applicable", critical: false, geth: "", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 7251, title: "Increase MAX_EFFECTIVE_BALANCE", status: "not_applicable", critical: false, geth: "", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 7514, title: "Add Max Epoch Churn", status: "not_applicable", critical: false, geth: "", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 7549, title: "Move committee index", status: "not_applicable", critical: false, geth: "", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    { eip: 7685, title: "Execution layer requests", status: "not_applicable", critical: false, geth: "", cosmos: "Not applicable", triage: "", note: "Using CometBFT", priority: 10 },
    // Additional Core EIPs from eips.ethereum.org
    { eip: 3, title: "Addition of CALLDEPTH opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 86, title: "Abstraction of transaction origin and signature", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 101, title: "Serenity Currency and Crypto Abstraction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 210, title: "Blockhash refactoring", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 615, title: "Subroutines and Static Jumps for the EVM", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 616, title: "SIMD Operations for the EVM", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 663, title: "SWAPN, DUPN and EXCHANGE instructions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 665, title: "Add precompiled contract for Ed25519 signature verification", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 689, title: "Address Collision of Contract Address Causes Exceptional Halt", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 698, title: "OPCODE 0x46 BLOCKREWARD", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 858, title: "Reduce block reward and delay difficulty bomb", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - CometBFT", triage: "", note: "No difficulty bomb needed", priority: 11 },
    { eip: 908, title: "Reward clients for a sustainable network", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 969, title: "Modifications to ethash to invalidate existing dedicated hardware implementations", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No PoW", triage: "", note: "Uses CometBFT consensus", priority: 11 },
    { eip: 999, title: "Restore Contract Code at 0x863DF6BFa4469f3ead0bE8f9F2AAE51c91A907b4", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "DAO fork specific", priority: 11 },
    { eip: 1010, title: "Uniformity Between 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B and 0x15E55EF43efA8348dDaeAa455F16C43B64917e3c", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Address-specific proposal", priority: 11 },
    { eip: 1011, title: "Hybrid Casper FFG", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Hybrid Casper not used", priority: 11 },
    { eip: 1015, title: "Configurable On Chain Issuance", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1051, title: "Overflow checking for the EVM", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1057, title: "ProgPoW, a Programmatic Proof-of-Work", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No PoW", triage: "", note: "ProgPoW not needed", priority: 11 },
    { eip: 1087, title: "Net gas metering for SSTORE operations", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1109, title: "PRECOMPILEDCALL opcode (Remove CALL costs for precompiled contracts)", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1227, title: "Defuse Difficulty Bomb and Reset Block Reward", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - CometBFT", triage: "", note: "No difficulty bomb needed", priority: 11 },
    { eip: 1240, title: "Remove Difficulty Bomb", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - CometBFT", triage: "", note: "No difficulty bomb needed", priority: 11 },
    { eip: 1276, title: "Eliminate Difficulty Bomb and Adjust Block Reward on Constantinople Shift", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - CometBFT", triage: "", note: "No difficulty bomb needed", priority: 11 },
    { eip: 1285, title: "Increase Gcallstipend gas in the CALL opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1295, title: "Modify Ethereum PoW Incentive Structure and Delay Difficulty Bomb", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - CometBFT", triage: "", note: "No difficulty bomb needed", priority: 11 },
    { eip: 1352, title: "Specify restricted address range for precompiles/system contracts", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1355, title: "Ethash 1a", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No Ethash", triage: "", note: "Uses CometBFT consensus", priority: 11 },
    { eip: 1380, title: "Reduced gas cost for call to self", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1418, title: "Blockchain Storage Rent Payment", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1482, title: "Define a maximum block timestamp drift", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Block timing via CometBFT", priority: 11 },
    { eip: 1485, title: "TEthashV1", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No Ethash", triage: "", note: "Uses CometBFT consensus", priority: 11 },
    { eip: 1681, title: "Temporal Replay Protection", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1682, title: "Storage Rent", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different state management", priority: 11 },
    { eip: 1702, title: "Generalized Account Versioning Scheme", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1706, title: "Disable SSTORE with gasleft lower than call stipend", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1829, title: "Precompile for Elliptic Curve Linear Combinations", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1890, title: "Commitment to Sustainable Ecosystem Funding", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Block rewards via Cosmos distribution", priority: 11 },
    { eip: 1895, title: "Support for an Elliptic Curve Cycle", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1930, title: "CALLs with strict gas semantic. Revert if not enough gas available.", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1959, title: "New Opcode to check if a chainID is part of the history of chainIDs", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1962, title: "EC arithmetic and pairings with runtime definitions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1965, title: "Method to check if a chainID is valid at a specific block Number", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 1985, title: "Sane limits for certain EVM parameters", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2014, title: "Extended State Oracle", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2025, title: "Block Rewards Proposal for funding Eth1.x", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Block rewards via Cosmos distribution", priority: 11 },
    { eip: 2026, title: "State Rent H - Fixed Prepayment for accounts", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different state management", priority: 11 },
    { eip: 2027, title: "State Rent C - Net contract size accounting", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different state management", priority: 11 },
    { eip: 2029, title: "State Rent A - State counters contract", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different state management", priority: 11 },
    { eip: 2031, title: "State Rent B - Net transaction counter", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different state management", priority: 11 },
    { eip: 2035, title: "Stateless Clients - Repricing SLOAD and SSTORE to pay for block proofs", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2045, title: "Particle gas costs for EVM opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2046, title: "Reduced gas cost for static calls made to precompiles", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2242, title: "Transaction Postdata", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2315, title: "Simple Subroutines for the EVM", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2327, title: "BEGINDATA opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2330, title: "EXTSLOAD opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2474, title: "Coinbase calls", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2488, title: "Deprecate the CALLCODE opcode", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "CALLCODE already deprecated", priority: 11 },
    { eip: 2515, title: "Implement Difficulty Freeze", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - CometBFT", triage: "", note: "No difficulty bomb needed", priority: 11 },
    { eip: 2539, title: "BLS12-377 curve operations", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2542, title: "New opcodes TXGASLIMIT and CALLGASLIMIT", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2583, title: "Penalty for account trie misses", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2584, title: "Trie format transition with overlay trees", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2593, title: "Escalator fee market change for ETH 1.0 chain", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2666, title: "Repricing of precompiles and Keccak256 function", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2677, title: "Limit size of `initcode`", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2711, title: "Sponsored, expiring and batch transactions.", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2733, title: "Transaction Package", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2780, title: "Reduce intrinsic transaction gas", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2803, title: "Rich Transactions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2926, title: "Chunk-Based Code Merkleization", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2936, title: "EXTCLEAR Opcode For SELFDESTRUCTed contracts", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2937, title: "SET_INDESTRUCTIBLE opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2938, title: "Account Abstraction", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Native account abstraction in Cosmos", priority: 11 },
    { eip: 2970, title: "IS_STATIC opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2972, title: "Wrapped Legacy Transactions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 2997, title: "IMPERSONATECALL Opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3026, title: "BW6-761 curve operations", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3068, title: "Precompile for BN256 HashToCurve Algorithms", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3074, title: "AUTH and AUTHCALL opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3102, title: "Binary trie structure", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different tree structure", priority: 11 },
    { eip: 3143, title: "Increase block rewards to 5 ETH", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Block rewards via Cosmos distribution", priority: 11 },
    { eip: 3220, title: "Crosschain Identifier Specification", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "IBC handles crosschain", priority: 11 },
    { eip: 3238, title: "Difficulty Bomb Delay to Q2/2022", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - CometBFT", triage: "", note: "No difficulty bomb needed", priority: 11 },
    { eip: 3267, title: "Giving Ethereum fees to Future Salaries", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Fees handled by Cosmos distribution", priority: 11 },
    { eip: 3298, title: "Removal of refunds", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3300, title: "Phase out refunds", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3322, title: "Account gas storage opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3332, title: "MEDGASPRICE Opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3336, title: "Paged memory allocation for the EVM", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3337, title: "Frame pointer support for memory load and store operations", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3338, title: "Limit account nonce to 2^52", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3368, title: "Increase block rewards to 3 ETH, with 2 Year Decay to 1 ETH Scheduled", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Block rewards via Cosmos distribution", priority: 11 },
    { eip: 3372, title: "5 FNV primes for ethash", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No Ethash", triage: "", note: "Uses CometBFT consensus", priority: 11 },
    { eip: 3374, title: "Predictable Proof-of-Work (POW) Sunsetting", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No PoW", triage: "", note: "Uses CometBFT consensus", priority: 11 },
    { eip: 3382, title: "Hardcoded Block Gas Limit", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3403, title: "Partial removal of refunds", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3416, title: "Median Gas Premium", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3436, title: "Expanded Clique Block Choice Rule", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No Clique", triage: "", note: "Uses CometBFT", priority: 11 },
    { eip: 3455, title: "SUDO Opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3508, title: "Transaction Data Opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3520, title: "Transaction Destination Opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3521, title: "Reduce access list cost", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3534, title: "Restricted Chain Context Type Transactions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3540, title: "EOF - EVM Object Format v1", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3584, title: "Block Access List", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3670, title: "EOF - Code Validation", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3690, title: "EOF - JUMPDEST Table", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3756, title: "Gas Limit Cap", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3779, title: "Safer Control Flow for the EVM", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3788, title: "Strict enforcement of chainId", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 3978, title: "Gas refunds on reverts", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4200, title: "EOF - Static relative jumps", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4396, title: "Time-Aware Base Fee Calculation", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4488, title: "Transaction calldata gas cost reduction with total calldata limit", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4520, title: "Multi-byte opcodes prefixed by EB and EC.", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4573, title: "Procedures for the EVM", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4747, title: "Simplify EIP-161", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4750, title: "EOF - Functions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4758, title: "Deactivate SELFDESTRUCT", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "SELFDESTRUCT handling differs", priority: 11 },
    { eip: 4760, title: "SELFDESTRUCT bomb", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "SELFDESTRUCT handling differs", priority: 11 },
    { eip: 4762, title: "Statelessness gas cost changes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4803, title: "Limit transaction gas to a maximum of 2^63-1", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 4863, title: "Beacon chain push withdrawals", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Uses CometBFT validators", priority: 11 },
    { eip: 5000, title: "MULDIV instruction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5003, title: "Insert Code into EOAs with AUTHUSURP", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5022, title: "Increase price of SSTORE from zero to non-zero to 40k gas", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5027, title: "Remove the limit on contract code size", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5065, title: "Instruction for transferring ether", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5081, title: "Expirable Transaction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5283, title: "Semaphore for Reentrancy Protection", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5450, title: "EOF - Stack Validation", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5478, title: "CREATE2COPY Opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5806, title: "Delegate transaction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5920, title: "PAY opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 5988, title: "Add Poseidon hash function precompile", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6046, title: "Replace SELFDESTRUCT with DEACTIVATE", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "SELFDESTRUCT handling differs", priority: 11 },
    { eip: 6188, title: "Nonce Cap", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6189, title: "Alias Contracts", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6190, title: "Verkle-compatible SELFDESTRUCT", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Verkle trees not implemented", priority: 11 },
    { eip: 6206, title: "EOF - JUMPF and non-returning functions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6404, title: "SSZ transactions", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - Uses protobuf", triage: "", note: "SSZ not used", priority: 11 },
    { eip: 6465, title: "SSZ withdrawals root", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No SSZ", triage: "", note: "Uses protobuf", priority: 11 },
    { eip: 6466, title: "SSZ receipts", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - Uses protobuf", triage: "", note: "SSZ not used", priority: 11 },
    { eip: 6475, title: "SSZ Optional", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - Uses protobuf", triage: "", note: "SSZ not used", priority: 11 },
    { eip: 6493, title: "SSZ transaction signature scheme", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - Uses protobuf", triage: "", note: "SSZ not used", priority: 11 },
    { eip: 6690, title: "EVM Modular Arithmetic Extensions", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "SSZ not used in Cosmos", priority: 11 },
    { eip: 6800, title: "Ethereum state using a unified verkle tree", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Verkle trees not implemented", priority: 11 },
    { eip: 6810, title: "Ex Post Facto Cascading Revert", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6811, title: "To The Moon—10 Minute Blocks", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Block timing via CometBFT", priority: 11 },
    { eip: 6873, title: "Preimage retention", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6888, title: "Arithmetic verification at EVM level", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6913, title: "SETCODE instruction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 6914, title: "Reuse Withdrawn Validator Indices", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Different validator system", priority: 11 },
    { eip: 6968, title: "Contract Secured Revenue on an EVM based L2", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "L2 specific feature", priority: 11 },
    { eip: 6988, title: "Elected block proposer has not been slashed", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Different slashing mechanism", priority: 11 },
    { eip: 7069, title: "Revamped CALL instructions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7266, title: "Remove BLAKE2 compression precompile", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7377, title: "Migration Transaction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7378, title: "Add time-weighted averaging to the base fee", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7441, title: "Upgrade block proposer election to Whisk", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Different proposer election", priority: 11 },
    { eip: 7480, title: "EOF - Data section access instructions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7495, title: "SSZ ProgressiveContainer", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - Uses protobuf", triage: "", note: "SSZ not used", priority: 11 },
    { eip: 7503, title: "Zero-Knowledge Wormholes", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "ZK wormholes not used", priority: 11 },
    { eip: 7519, title: "Atomic Storage Operations SCREDIT and SDEBIT", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7523, title: "Empty accounts deprecation", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different account model", priority: 11 },
    { eip: 7543, title: "EVM arbitrary precision decimal math", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7545, title: "Verkle proof verification precompile", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Verkle trees not implemented", priority: 11 },
    { eip: 7547, title: "Inclusion lists", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "No inclusion lists with CometBFT", priority: 11 },
    { eip: 7557, title: "Block-level Warming with fair cost savings", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7591, title: "BLS signed transactions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7609, title: "Decrease base cost of TLOAD/TSTORE", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7610, title: "Revert creation in case of non-empty storage", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7612, title: "Verkle state transition via an overlay tree", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Verkle trees not implemented", priority: 11 },
    { eip: 7620, title: "EOF Contract Creation", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7637, title: "Optimize EOA EXTCODEHASH", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7643, title: "History accumulator for pre-PoS data", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7645, title: "Alias ORIGIN to SENDER", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7650, title: "Programmable access lists", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7657, title: "Sync committee slashings", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No sync committee", triage: "", note: "Different consensus", priority: 11 },
    { eip: 7658, title: "Light client data backfill", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Different light client", priority: 11 },
    { eip: 7664, title: "Access-Key opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7666, title: "EVM-ify the identity precompile", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7667, title: "Raise gas costs of hash functions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7668, title: "Remove bloom filters", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7676, title: "EOF - Prepare for Address Space Extension", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7684, title: "Return deposits for distinct credentials", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Different deposit mechanism", priority: 11 },
    { eip: 7686, title: "Linear EVM memory limits", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7688, title: "Forward compatible consensus data structures", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7698, title: "EOF - Creation transaction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7701, title: "Native Account Abstraction", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Native account abstraction in Cosmos", priority: 11 },
    { eip: 7703, title: "Increase calldata cost", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7705, title: "NONREENTRANT and REENTRANT opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7706, title: "Separate gas type for calldata", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7707, title: "Incentivize Access List Provisioning", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7708, title: "ETH transfers emit a log", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7709, title: "Read BLOCKHASH from storage and update cost", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7716, title: "Anti-correlation attestation penalties", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No attestations", triage: "", note: "Different consensus", priority: 11 },
    { eip: 7727, title: "EVM Transaction Bundles", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7732, title: "Enshrined Proposer-Builder Separation", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No PBS", triage: "", note: "CometBFT handles block production", priority: 11 },
    { eip: 7736, title: "Leaf-level state expiry in verkle trees", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Verkle trees not implemented", priority: 11 },
    { eip: 7742, title: "Uncouple blob count between CL and EL", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7745, title: "Light client and DHT friendly log index", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7748, title: "State conversion to Verkle Tree", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Verkle trees not implemented", priority: 11 },
    { eip: 7761, title: "EXTCODETYPE instruction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7762, title: "Increase MIN_BASE_FEE_PER_BLOB_GAS", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7775, title: "BURN opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7778, title: "Block Gas Limit Accounting without Refunds", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7782, title: "Reduce Block Latency", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Block latency via CometBFT", priority: 11 },
    { eip: 7784, title: "GETCONTRACT opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7788, title: "Dynamic target blob count", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7791, title: "GAS2ETH opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7792, title: "Verifiable logs", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7793, title: "Conditional Transactions", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7797, title: "Double speed for hash_tree_root", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7799, title: "System logs", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7804, title: "Withdrawal Credential Update Request", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Different withdrawal system", priority: 11 },
    { eip: 7805, title: "Fork-choice enforced Inclusion Lists (FOCIL)", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No FOCIL", triage: "", note: "Different consensus mechanism", priority: 11 },
    { eip: 7807, title: "SSZ execution blocks", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - Uses protobuf", triage: "", note: "SSZ not used", priority: 11 },
    { eip: 7819, title: "SETDELEGATE instruction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7823, title: "Set upper bounds for MODEXP", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7825, title: "Transaction Gas Limit Cap", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7830, title: "Contract size limit increase for EOF", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7833, title: "Scheduled function calls", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7834, title: "Separate Metadata Section for EOF", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7843, title: "SLOTNUM opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7848, title: "On-chain upgrade signaling", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7851, title: "Deactivate/Reactivate a Delegated EOA's Key", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7862, title: "Delayed State Root", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7863, title: "Block-level Warming", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7864, title: "Ethereum state using a unified binary tree", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Different tree structure", priority: 11 },
    { eip: 7873, title: "EOF - TXCREATE and InitcodeTransaction type", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7877, title: "Enhanced RETURN opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7880, title: "EOF - EXTCODEADDRESS instruction", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7883, title: "ModExp Gas Cost Increase", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7886, title: "Delayed execution", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7889, title: "Emit log on revert", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7898, title: "Uncouple execution payload from beacon block", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Payload coupled with CometBFT", priority: 11 },
    { eip: 7903, title: "Remove Initcode Size Limit", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7904, title: "General Repricing", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7907, title: "Meter Contract Code Size And Increase Limit", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7912, title: "Pragmatic stack manipulation tools", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7915, title: "Adaptive mean reversion blob pricing", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7916, title: "SSZ ProgressiveList", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - Uses protobuf", triage: "", note: "SSZ not used", priority: 11 },
    { eip: 7917, title: "Deterministic proposer lookahead", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable", triage: "", note: "Proposer selection via CometBFT", priority: 11 },
    { eip: 7918, title: "Blob base fee bounded by execution cost", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7921, title: "Skip `JUMPDEST` immediate argument check", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7922, title: "Dynamic exit queue rate limit", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No beacon chain", triage: "", note: "Different validator exit", priority: 11 },
    { eip: 7923, title: "Linear, Page-Based Memory Costing", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7928, title: "Block-Level Access Lists", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7932, title: "Secondary Signature Algorithms", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7934, title: "RLP Execution Block Size Limit", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7937, title: "EVM64 - 64-bit mode EVM opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7939, title: "Count leading zeros (CLZ) opcode", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7942, title: "Available Attestation", status: "not_applicable", critical: false, geth: "Unknown", cosmos: "Not applicable - No attestations", triage: "", note: "Different consensus", priority: 11 },
    { eip: 7951, title: "Precompile for secp256r1 Curve Support", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7954, title: "Increase Maximum Contract Size", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7956, title: "Tx Ordering via Block-level Randomness", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7957, title: "EVM64 - EOF support", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7958, title: "EVM64 - Little endian opcodes", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7960, title: "EOF - Extended types section", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7961, title: "EVM64 - EOF code section", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7976, title: "Further increase calldata cost", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    { eip: 7981, title: "Increase access list cost", status: "unknown", critical: false, geth: "Unknown", cosmos: "Unknown", triage: "", note: "To be reviewed", priority: 11 },
    // Additional mainnet-activated EIPs
    { eip: 8, title: "devp2p Forward Compatibility Requirements", status: "supported", critical: false, geth: "Activated", cosmos: "Supported", triage: "", note: "Activated in Homestead", priority: 9 },
    { eip: 6049, title: "Deprecate SELFDESTRUCT", status: "supported", critical: false, geth: "Activated", cosmos: "Supported", triage: "", note: "Activated in Shanghai", priority: 9 }
  ];

  const statusOptions = {
    all: 'All',
    not_supported: 'Not Supported',
    partial: 'Partial',
    supported: 'Supported',
    not_applicable: 'N/A',
    unknown: 'Unknown'
  };

  const criticalityOptions = {
    all: 'All',
    critical: 'Critical',
    non_critical: 'Non-Critical'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'supported': return '✓';
      case 'partial': return '◐';
      case 'not_supported': return '✗';
      case 'not_applicable': return '—';
      case 'unknown': return '?';
      default: return '?';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'supported': return 'text-green-600 dark:text-green-400';
      case 'partial': return 'text-yellow-600 dark:text-yellow-400';
      case 'not_supported': return 'text-red-600 dark:text-red-400';
      case 'not_applicable': return 'text-gray-400 dark:text-gray-500';
      case 'unknown': return 'text-gray-500 dark:text-gray-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };

  const filteredData = useMemo(() => {
    let filtered = [...eipData];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.eip.toString().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cosmos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.note.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (criticalityFilter === 'critical') {
      filtered = filtered.filter(item => item.critical === true);
    } else if (criticalityFilter === 'non_critical') {
      filtered = filtered.filter(item => item.critical === false);
    }

    return filtered.sort((a, b) => a.priority - b.priority);
  }, [searchTerm, statusFilter, criticalityFilter]);

  const stats = useMemo(() => {
    const total = eipData.length;
    const supported = eipData.filter(e => e.status === 'supported').length;
    const partial = eipData.filter(e => e.status === 'partial').length;
    const notSupported = eipData.filter(e => e.status === 'not_supported').length;
    const notApplicable = eipData.filter(e => e.status === 'not_applicable').length;
    const unknown = eipData.filter(e => e.status === 'unknown').length;
    
    return {
      total,
      supported,
      partial,
      notSupported,
      notApplicable,
      unknown,
      percentage: Math.round((supported / (total - notApplicable - unknown)) * 100)
    };
  }, []);

  return (
    <div className="eip-compatibility-table max-w-full mx-auto px-4 py-6">
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">EIP Compatibility Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Total:</span>
            <span className="ml-2 font-semibold text-black dark:text-white">{stats.total}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Supported:</span>
            <span className="ml-2 font-semibold text-green-600 dark:text-green-400">{stats.supported}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Partial:</span>
            <span className="ml-2 font-semibold text-yellow-600 dark:text-yellow-400">{stats.partial}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Not Supported:</span>
            <span className="ml-2 font-semibold text-red-600 dark:text-red-400">{stats.notSupported}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">N/A:</span>
            <span className="ml-2 font-semibold text-gray-500 dark:text-gray-400">{stats.notApplicable}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Unknown:</span>
            <span className="ml-2 font-semibold text-gray-500 dark:text-gray-400">{stats.unknown}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Compatibility Rate: <span className="font-semibold text-black dark:text-white">{stats.percentage}%</span>
            <span className="text-xs ml-2">(excluding N/A and Unknown)</span>
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search EIPs by number, title, or description..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900 text-black dark:text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {Object.entries(statusOptions).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-900 text-black dark:text-white"
          value={criticalityFilter}
          onChange={(e) => setCriticalityFilter(e.target.value)}
        >
          {Object.entries(criticalityOptions).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-sm text-black dark:text-white w-20">EIP</th>
              <th className="text-left px-4 py-3 font-semibold text-sm text-black dark:text-white">Title</th>
              <th className="text-center px-4 py-3 font-semibold text-sm text-black dark:text-white w-20">Status</th>
              <th className="text-center px-4 py-3 font-semibold text-sm text-black dark:text-white w-20">Critical</th>
              <th className="text-left px-4 py-3 font-semibold text-sm text-black dark:text-white min-w-[300px]">Implementation</th>
              <th className="text-left px-4 py-3 font-semibold text-sm text-black dark:text-white hidden xl:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-950">
            {filteredData.map((item, index) => (
              <tr key={item.eip} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <td className="px-4 py-3">
                  <a 
                    href={`https://eips.ethereum.org/EIPS/eip-${item.eip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-sm font-medium"
                  >
                    {item.eip}
                  </a>
                  {item.issue && (
                    <a
                      href={`https://github.com/cosmos/evm/issues/${item.issue}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      #{item.issue}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-black dark:text-white">{item.title}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-2xl font-bold ${getStatusColor(item.status)}`} title={statusOptions[item.status]}>
                    {getStatusIcon(item.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.critical ? (
                    <span className="inline-block w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full" title="Critical"></span>
                  ) : (
                    <span className="inline-block w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" title="Non-critical"></span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-700 dark:text-gray-300">{item.cosmos}</div>
                    {item.triage === 'Red' && (
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        <span className="text-xs text-red-600 dark:text-red-400">Needs compatibility review</span>
                      </div>
                    )}
                    {item.triage === 'Blue' && (
                      <div className="flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        <span className="text-xs text-blue-600 dark:text-blue-400">Non-critical difference</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden xl:table-cell">
                  {item.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No EIPs found matching your criteria
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <p className="font-semibold text-sm mb-3 text-black dark:text-white">Legend</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400 w-8">✓</span>
              <span className="text-gray-600 dark:text-gray-400">Fully Supported</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 w-8">◐</span>
              <span className="text-gray-600 dark:text-gray-400">Partial Support</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400 w-8">✗</span>
              <span className="text-gray-600 dark:text-gray-400">Not Supported</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 w-8">—</span>
              <span className="text-gray-600 dark:text-gray-400">Not Applicable</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-500 dark:text-gray-400 w-8">?</span>
              <span className="text-gray-600 dark:text-gray-400">Unknown/Under Review</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></span>
              <span className="text-gray-600 dark:text-gray-400">Critical for EVM compatibility</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              <span className="text-gray-600 dark:text-gray-400">Non-critical or optional</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              <span className="text-gray-600 dark:text-gray-400">Needs compatibility review</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              <span className="text-gray-600 dark:text-gray-400">Non-critical difference from Geth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}