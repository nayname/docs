export default function EIPCompatibilityTable() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'asc' });

  // Embedded EIP data
  const eipData = [
    {
      "eip": 2,
      "title": "Homestead Hard-fork Changes",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 5,
      "title": "Gas Usage for RETURN and CALL",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "Not Supported",
      "note": "This feature does not exist on geth",
      "issue": ""
    },
    {
      "eip": 7,
      "title": "DELEGATECALL",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 100,
      "title": "Difficulty adjustment",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "Intrinsic to CometBFT",
      "note": "",
      "issue": ""
    },
    {
      "eip": 140,
      "title": "REVERT instruction",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 141,
      "title": "Designated invalid EVM instruction",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 145,
      "title": "Bitwise shifting instructions",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 150,
      "title": "Gas cost changes for IO-heavy operations",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 152,
      "title": "BLAKE2 compression function precompile",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 155,
      "title": "Simple replay attack protection",
      "status": "partial",
      "critical": true,
      "cosmos": "Currently enforced through chain-wide params",
      "note": "Will be supported with PR #415",
      "issue": 401
    },
    {
      "eip": 158,
      "title": "State clearing",
      "status": "supported",
      "critical": false,
      "cosmos": "StateDB.Finalise",
      "note": "",
      "issue": ""
    },
    {
      "eip": 160,
      "title": "EXP cost increase",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 161,
      "title": "State trie clearing",
      "status": "supported",
      "critical": false,
      "cosmos": "Not Supported",
      "note": "",
      "issue": ""
    },
    {
      "eip": 170,
      "title": "Contract code size limit",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 196,
      "title": "Elliptic curve alt_bn128 operations",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 197,
      "title": "Elliptic curve alt_bn128 pairing",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 198,
      "title": "Big integer modular exponentiation",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 211,
      "title": "RETURNDATASIZE and RETURNDATACOPY",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 214,
      "title": "STATICCALL opcode",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 225,
      "title": "Clique proof-of-authority",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 649,
      "title": "Metropolis Difficulty Bomb",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 658,
      "title": "Transaction status in receipts",
      "status": "supported",
      "critical": true,
      "cosmos": "Implemented",
      "note": "",
      "issue": ""
    },
    {
      "eip": 684,
      "title": "Revert creation on collision",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 1014,
      "title": "CREATE2",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 1052,
      "title": "EXTCODEHASH opcode",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 1108,
      "title": "Reduce alt_bn128 gas costs",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 1153,
      "title": "Transient storage opcodes",
      "status": "supported",
      "critical": true,
      "cosmos": "TransientStorage",
      "note": "",
      "issue": ""
    },
    {
      "eip": 1234,
      "title": "Constantinople Difficulty Bomb",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 1283,
      "title": "Net gas metering for SSTORE",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 1344,
      "title": "ChainID opcode",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 1559,
      "title": "Fee market change (EIP-1559)",
      "status": "supported",
      "critical": true,
      "cosmos": "Feemarket module",
      "note": "Can configure baseFee param, distributed to validators instead of burned",
      "issue": ""
    },
    {
      "eip": 1884,
      "title": "Repricing trie-size-dependent opcodes",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2028,
      "title": "Transaction data gas cost reduction",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2200,
      "title": "Net Gas Metering",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2384,
      "title": "Muir Glacier Difficulty Bomb",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 2537,
      "title": "BLS12-381 curve operations",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2565,
      "title": "ModExp Gas Cost",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2681,
      "title": "Limit account nonce to 2^64-1",
      "status": "supported",
      "critical": true,
      "cosmos": "Missing strict overflow check at Antehandler",
      "note": "Added in PR#408",
      "issue": 400
    },
    {
      "eip": 2718,
      "title": "Typed Transaction Envelope",
      "status": "supported",
      "critical": true,
      "cosmos": "Using Geth's Transaction Marshaling",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2929,
      "title": "Gas cost increases for state access",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2930,
      "title": "Optional access lists",
      "status": "supported",
      "critical": true,
      "cosmos": "Implemented AccessList",
      "note": "",
      "issue": ""
    },
    {
      "eip": 2935,
      "title": "Serve historical block hashes from state",
      "status": "not_supported",
      "critical": false,
      "cosmos": "N/A",
      "note": "Mainly for stateless clients, rollups, zk",
      "issue": ""
    },
    {
      "eip": 3198,
      "title": "BASEFEE opcode",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 3529,
      "title": "Reduction in refunds",
      "status": "supported",
      "critical": true,
      "cosmos": "ApplyMessageWithConfig",
      "note": "",
      "issue": ""
    },
    {
      "eip": 3541,
      "title": "Reject 0xEF bytecode",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 3554,
      "title": "Difficulty Bomb Delay 2021",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 3607,
      "title": "Reject transactions from code",
      "status": "supported",
      "critical": true,
      "cosmos": "VerifyAccountBalance",
      "note": "",
      "issue": ""
    },
    {
      "eip": 3651,
      "title": "Warm COINBASE",
      "status": "partial",
      "critical": false,
      "cosmos": "Implemented",
      "note": "Always empty address currently",
      "issue": ""
    },
    {
      "eip": 3675,
      "title": "Upgrade to Proof-of-Stake",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 3855,
      "title": "PUSH0 instruction",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 3860,
      "title": "Limit and meter initcode",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 4345,
      "title": "Difficulty Bomb Delay 2022",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 4399,
      "title": "Supplant DIFFICULTY opcode with PREVRANDAO",
      "status": "not_supported",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 4788,
      "title": "Beacon block root in the EVM",
      "status": "not_supported",
      "critical": false,
      "cosmos": "Little to No Effect",
      "note": "Not critical for Cosmos EVM",
      "issue": 404
    },
    {
      "eip": 4844,
      "title": "Shard Blob Transactions",
      "status": "not_supported",
      "critical": false,
      "cosmos": "N/A",
      "note": "Related to Layer 2 scaling",
      "issue": ""
    },
    {
      "eip": 4895,
      "title": "Beacon chain withdrawals",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 5133,
      "title": "Difficulty Bomb Delay Sept 2022",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "Not relevant to proof-of-stake networks",
      "issue": ""
    },
    {
      "eip": 5656,
      "title": "MCOPY - Memory copying",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 6110,
      "title": "Supply validator deposits",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "Intrinsic to CometBFT",
      "note": "",
      "issue": ""
    },
    {
      "eip": 6780,
      "title": "SELFDESTRUCT only in same transaction",
      "status": "partial",
      "critical": false,
      "cosmos": "Implemented",
      "note": "Handling is diffferent, but no end-user impact",
      "issue": ""
    },
    {
      "eip": 6916,
      "title": "Automatically Reset Testnet",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7002,
      "title": "Execution layer withdrawals",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7044,
      "title": "Perpetually Valid Exits",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7045,
      "title": "Increase attestation slot",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7251,
      "title": "Increase MAX_EFFECTIVE_BALANCE",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7514,
      "title": "Add Max Epoch Churn",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7516,
      "title": "BLOBBASEFEE instruction",
      "status": "supported",
      "critical": true,
      "cosmos": "Upstream go-ethereum",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7549,
      "title": "Move committee index",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7623,
      "title": "Increase calldata cost",
      "status": "not_supported",
      "critical": false,
      "cosmos": "Little to No Effect",
      "note": "Not critical, no direct impact on users/devs",
      "issue": ""
    },
    {
      "eip": 7685,
      "title": "Execution layer requests",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "",
      "issue": ""
    },
    {
      "eip": 7691,
      "title": "Blob throughput increase",
      "status": "not_applicable",
      "critical": false,
      "cosmos": "N/A",
      "note": "We don't have blob transactions",
      "issue": ""
    },
    {
      "eip": 7702,
      "title": "Set Code for EOAs",
      "status": "not_supported",
      "critical": true,
      "cosmos": "In Development",
      "note": "Will be supported in v0.5.0",
      "issue": ""
    }
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...eipData];

    // Define status priority (higher = better)
    const statusPriority = {
      'supported': 4,
      'partial': 3,
      'not_applicable': 2,
      'unknown': 1,
      'not_supported': 0
    };

    sortableItems.sort((a, b) => {
      const aPriority = statusPriority[a.status] || 0;
      const bPriority = statusPriority[b.status] || 0;

      // Primary sort: Status (unless user is sorting by another column)
      if (sortConfig.key !== 'status' && aPriority !== bPriority) {
        return bPriority - aPriority; // Always show supported items first
      }

      // Secondary sort: User's selected column
      const key = sortConfig.key || 'eip';
      let aVal = a[key];
      let bVal = b[key];

      // Special handling for status column with user direction
      if (key === 'status') {
        if (aPriority !== bPriority) {
          return sortConfig.direction === 'asc' ? bPriority - aPriority : aPriority - bPriority;
        }
        return 0;
      }

      // Handle null/undefined
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Normalize values for comparison
      if (typeof aVal === 'boolean') {
        aVal = aVal ? 1 : 0;
        bVal = bVal ? 1 : 0;
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      // Apply sort direction
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [sortConfig]);

  const filteredData = sortedData.filter(eip => {
    if (!eip || !eip.eip) return false;

    const matchesSearch = searchTerm === '' ||
      String(eip.eip).includes(searchTerm) ||
      (eip.title && eip.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (eip.note && eip.note.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const statusColors = {
    'supported': 'text-green-600 dark:text-green-400',
    'partial': 'text-yellow-600 dark:text-yellow-400',
    'not_supported': 'text-red-600 dark:text-red-400',
    'not_applicable': 'text-gray-500 dark:text-gray-400',
    'unknown': 'text-gray-400 dark:text-gray-500'
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <span className="text-gray-400 ml-1">↕</span>;
    }
    return sortConfig.direction === 'asc' ?
      <span className="text-blue-600 ml-1">↑</span> :
      <span className="text-blue-600 ml-1">↓</span>;
  };

  return (
    <div className="w-full bg-white dark:bg-black relative p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
      {/* Search and Filters - Sticky */}
      <div className="sticky top-0 z-20 bg-white dark:bg-black pb-4 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by EIP number, title, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredData.length} of {eipData.length} EIPs
          </div>
        </div>
      </div>

      {/* Table with sticky header */}
      <div className="overflow-auto shadow-[0_0_0_1px_rgba(156,163,175,0.3)] dark:shadow-[0_0_0_1px_rgba(75,85,99,0.5)] rounded-lg mt-4" style={{ maxHeight: 'calc(100vh - 240px)' }}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800 relative">
          <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('eip')}
              >
                EIP <SortIcon column="eip" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('title')}
              >
                Title <SortIcon column="title" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon column="status" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('critical')}
              >
                Critical <SortIcon column="critical" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleSort('cosmos')}
              >
                Implementation <SortIcon column="cosmos" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
            {filteredData.map((eip, index) => (
              <tr key={eip.eip} className={`${index % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-gray-900'} hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  <a
                    href={`https://eips.ethereum.org/EIPS/eip-${eip.eip}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    {eip.eip}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {eip.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`font-medium ${statusColors[eip.status]}`}>
                    {eip.status ? eip.status.replace(/_/g, ' ') : ''}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {eip.critical ? 'Yes' : '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {eip.cosmos}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {eip.note}
                  {eip.issue && (
                    <a
                      href={`https://github.com/cosmos/evm/issues/${eip.issue}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      #{eip.issue}
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}