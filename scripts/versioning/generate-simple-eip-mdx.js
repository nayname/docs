#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get version from command line argument
const version = process.argv[2];
if (!version) {
  console.error('Usage: node generate-simple-eip-mdx.js <version>');
  process.exit(1);
}

// Read the snapshot data
const snapshotPath = path.join(version, 'eip-data-snapshot.json');
if (!fs.existsSync(snapshotPath)) {
  console.error(`Snapshot file not found: ${snapshotPath}`);
  process.exit(1);
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
const eipData = snapshot.data || [];

// Remove status counting as it's not needed anymore

// Sort data by status priority then EIP number
const statusPriority = {
  'supported': 4,
  'partial': 3,
  'not_applicable': 2,
  'unknown': 1,
  'not_supported': 0
};

const sortedData = [...eipData].sort((a, b) => {
  const aPriority = statusPriority[a.status] || 0;
  const bPriority = statusPriority[b.status] || 0;
  if (aPriority !== bPriority) {
    return bPriority - aPriority;
  }
  return a.eip - b.eip;
});

// Generate the MDX content with inline component
const mdxContent = `---
title: "EIP Reference"
description: "A complete list of Ethereum Mainnet \\"Final\\" EIPs and details on their implementation with Cosmos-EVM"
mode: "custom"
keywords: ['eip', 'ethereum improvement proposals', 'compatibility', 'support', 'implementation', 'cosmos evm', 'matrix', 'table']
---

{/* Static snapshot taken on ${snapshot.timestamp} for version ${version} */}

export const EIPData = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [currentSort, setCurrentSort] = React.useState('default');

  const data = ${JSON.stringify(sortedData, null, 2).replace(/^/gm, '  ').trim()};

  const statusColors = {
    'supported': 'text-green-600 dark:text-green-400',
    'partial': 'text-yellow-600 dark:text-yellow-400',
    'not_supported': 'text-red-600 dark:text-red-400',
    'not_applicable': 'text-gray-500 dark:text-gray-400',
    'unknown': 'text-gray-400 dark:text-gray-500'
  };

  const statusPriority = {
    'supported': 4,
    'partial': 3,
    'not_applicable': 2,
    'unknown': 1,
    'not_supported': 0
  };

  const getSortedData = () => {
    let sorted = [...data];

    if (currentSort === 'eip-asc') {
      sorted.sort((a, b) => a.eip - b.eip);
    } else if (currentSort === 'eip-desc') {
      sorted.sort((a, b) => b.eip - a.eip);
    } else if (currentSort === 'title-asc') {
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (currentSort === 'title-desc') {
      sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else if (currentSort === 'status-asc') {
      sorted.sort((a, b) => {
        const aPriority = statusPriority[a.status] || 0;
        const bPriority = statusPriority[b.status] || 0;
        return bPriority - aPriority;
      });
    } else if (currentSort === 'status-desc') {
      sorted.sort((a, b) => {
        const aPriority = statusPriority[a.status] || 0;
        const bPriority = statusPriority[b.status] || 0;
        return aPriority - bPriority;
      });
    }

    return sorted;
  };

  const filteredData = getSortedData().filter(eip => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      String(eip.eip).includes(search) ||
      (eip.title && eip.title.toLowerCase().includes(search)) ||
      (eip.note && eip.note.toLowerCase().includes(search)) ||
      (eip.cosmos && eip.cosmos.toLowerCase().includes(search))
    );
  });

  return (
    <div className="w-full bg-white dark:bg-black relative p-6 border border-gray-200 dark:border-gray-800 rounded-lg">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by EIP number, title, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredData.length} of {data.length} EIPs
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-4">
        <select
          value={currentSort}
          onChange={(e) => setCurrentSort(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white"
        >
          <option value="default">Default Sort (Status Priority)</option>
          <option value="eip-asc">EIP Number (Ascending)</option>
          <option value="eip-desc">EIP Number (Descending)</option>
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="status-asc">Status (Best First)</option>
          <option value="status-desc">Status (Worst First)</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-[0_0_0_1px_rgba(156,163,175,0.3)] dark:shadow-[0_0_0_1px_rgba(75,85,99,0.5)] rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                EIP
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Critical
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Implementation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
            {filteredData.map((eip, index) => (
              <tr key={eip.eip} className={\`\${index % 2 === 0 ? 'bg-white dark:bg-black' : 'bg-gray-50 dark:bg-gray-900'} hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors\`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a
                    href={\`https://eips.ethereum.org/EIPS/eip-\${eip.eip}\`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {eip.eip}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {eip.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={\`font-medium \${statusColors[eip.status]}\`}>
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
                    <>
                      {' '}
                      <a
                        href={\`https://github.com/cosmos/evm/issues/\${eip.issue}\`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        #{eip.issue}
                      </a>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

## EIP Compatibility Table

This page provides a comprehensive list of Ethereum Improvement Proposals (EIPs) and their implementation status in Cosmos EVM version ${version}.

<EIPData />

---

*This is a static snapshot of EIP compatibility data frozen on ${new Date(snapshot.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} for version ${version}.*
`;

// Write the generated MDX content
const outputPath = path.join(version, 'documentation', 'evm-compatibility', 'eip-reference.mdx');
fs.writeFileSync(outputPath, mdxContent);

console.log(`✓ Generated simplified MDX file: ${outputPath}`);
console.log(`  - Contains ${eipData.length} EIP entries`);
console.log(`  - Snapshot timestamp: ${snapshot.timestamp}`);