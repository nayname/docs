#!/usr/bin/env node

const fs = require('fs');

function parseFullChangelog(content) {
  const lines = content.split('\n');
  const versions = [];
  let currentVersion = null;
  let currentDate = null;
  let currentCategory = null;
  let categories = {};

  // Define standard categories in the order they should appear
  const standardCategories = [
    'DEPENDENCIES',
    'BUG FIXES',
    'IMPROVEMENTS',
    'FEATURES',
    'STATE BREAKING',
    'API-BREAKING',
    'API BREAKING' // Handle both formats
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip the main CHANGELOG header
    if (trimmedLine === '# CHANGELOG') {
      continue;
    }

    // Match version headers like "## v0.4.1" or "## [v0.4.1] - 2024-10-11"
    const versionMatch = trimmedLine.match(/^##\s+\[?(v[\d\.\-\w]+)\]?\s*(?:-\s*(.+))?$/);

    if (versionMatch) {
      // Save previous version if exists
      if (currentVersion && Object.keys(categories).some(cat => categories[cat].length > 0)) {
        versions.push({
          version: currentVersion,
          date: currentDate || new Date().toISOString().split('T')[0],
          categories: { ...categories }
        });
      }

      // Start new version
      currentVersion = versionMatch[1];
      currentDate = versionMatch[2] || null;

      // Try to extract date if it's in format "2024-10-11" or similar
      if (currentDate) {
        const dateMatch = currentDate.match(/(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          currentDate = dateMatch[1];
        }
      }

      categories = {};
      currentCategory = null;
      continue;
    }

    // Skip UNRELEASED section
    if (trimmedLine === '## UNRELEASED') {
      // Save previous version before skipping
      if (currentVersion && Object.keys(categories).some(cat => categories[cat].length > 0)) {
        versions.push({
          version: currentVersion,
          date: currentDate || new Date().toISOString().split('T')[0],
          categories: { ...categories }
        });
      }
      currentVersion = null;
      categories = {};
      currentCategory = null;
      continue;
    }

    // Match category headers (### FEATURES, ### BUG FIXES, etc.)
    if (currentVersion && trimmedLine.startsWith('### ')) {
      const categoryName = trimmedLine.replace('### ', '').trim();

      // Only process standard categories
      if (standardCategories.some(cat => cat === categoryName || cat.replace(/[-_]/g, ' ') === categoryName.replace(/[-_]/g, ' '))) {
        currentCategory = categoryName;
        if (!categories[currentCategory]) {
          categories[currentCategory] = [];
        }
      } else {
        currentCategory = null; // Ignore non-standard categories
      }
      continue;
    }

    // Collect items under categories
    if (currentVersion && currentCategory && trimmedLine && !trimmedLine.startsWith('#')) {
      // Skip separator lines and empty content
      if (trimmedLine !== '---' && trimmedLine !== '___' && trimmedLine !== '***') {
        // Parse entries with PR links
        if (trimmedLine.startsWith('- ')) {
          categories[currentCategory].push(trimmedLine);
        }
      }
    }
  }

  // Save last version if exists
  if (currentVersion && Object.keys(categories).some(cat => categories[cat].length > 0)) {
    versions.push({
      version: currentVersion,
      date: currentDate || new Date().toISOString().split('T')[0],
      categories: { ...categories }
    });
  }

  return versions;
}

function formatChangelogEntry(item) {
  // Parse entries like: - [\#459](https://github.com/cosmos/evm/pull/459) Update `cosmossdk.io/log`...
  const prMatch = item.match(/^-\s*\[\\?#(\d+)\]\((https?:\/\/[^\)]+)\)\s*(.+)$/);

  if (prMatch) {
    const prNumber = prMatch[1];
    const prUrl = prMatch[2];
    const description = prMatch[3];

    // Format as: Description ([#459](url))
    return `${description} ([#${prNumber}](${prUrl}))`;
  }

  // If no PR link, just clean up the bullet point
  return item.replace(/^-\s*/, '');
}

function convertToMintlify(versions) {
  let mdxContent = `---
title: "Release Notes"
description: "Release history and changelog for Cosmos EVM"
---

<Info>
  This page tracks all releases and changes from the [cosmos/evm](https://github.com/cosmos/evm) repository.
  For the latest development updates, see the [UNRELEASED](https://github.com/cosmos/evm/blob/main/CHANGELOG.md#unreleased) section.
</Info>

`;

  // Define the order we want to display categories with better labels
  const categoryConfig = [
    { key: 'FEATURES', label: 'Features', icon: '' },
    { key: 'IMPROVEMENTS', label: 'Improvements', icon: '' },
    { key: 'BUG FIXES', label: 'Bug Fixes', icon: '' },
    { key: 'DEPENDENCIES', label: 'Dependencies', icon: '' },
    { key: 'STATE BREAKING', label: 'State Breaking', icon: '' },
    { key: 'API-BREAKING', label: 'API Breaking', icon: '' },
    { key: 'API BREAKING', label: 'API Breaking', icon: '' }
  ];

  // Process each version
  versions.forEach(({ version, date, categories }) => {
    let updateContent = '';
    let hasContent = false;

    // Process categories in preferred order
    categoryConfig.forEach(({ key, label, icon }) => {
      const matchingCategory = Object.keys(categories).find(
        cat => cat === key || cat.replace(/[-_]/g, ' ') === key.replace(/[-_]/g, ' ')
      );

      if (matchingCategory && categories[matchingCategory].length > 0) {
        hasContent = true;
        updateContent += `## ${icon} ${label}\n\n`;

        categories[matchingCategory].forEach(item => {
          if (item.trim()) {
            const formattedItem = formatChangelogEntry(item);
            updateContent += `* ${formattedItem}\n`;
          }
        });

        updateContent += '\n';
      }
    });

    // Only add the Update component if there's content
    if (hasContent) {
      // Format the date nicely if available
      let dateLabel = date;
      if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = date.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dateLabel = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
      }

      mdxContent += `<Update label="${dateLabel || 'Release'}" description="${version}" tags={["EVM", "Release"]}>
${updateContent.trim()}
</Update>

`;
    }
  });

  // Add footer with links
  mdxContent += `---

<CardGroup cols={2}>
  <Card title="View Full Changelog" icon="github" href="https://github.com/cosmos/evm/blob/main/CHANGELOG.md">
    See the complete changelog on GitHub
  </Card>
  <Card title="Report Issues" icon="bug" href="https://github.com/cosmos/evm/issues">
    Report bugs or request features
  </Card>
</CardGroup>
`;

  return mdxContent;
}

// Main execution
try {
  const changelogContent = fs.readFileSync('./tmp/changelog.md', 'utf8');
  const versions = parseFullChangelog(changelogContent);

  console.log(` Parsed ${versions.length} versions from changelog`);

  if (versions.length === 0) {
    console.error(' No versions found in changelog');
    process.exit(1);
  }

  // Show summary of what was parsed
  versions.forEach(v => {
    const totalChanges = Object.values(v.categories).reduce((sum, cat) => sum + cat.length, 0);
    console.log(`  ✓ ${v.version}: ${totalChanges} changes across ${Object.keys(v.categories).length} categories`);
  });

  const mintlifyContent = convertToMintlify(versions);
  fs.writeFileSync('./tmp/release-notes.mdx', mintlifyContent);

  console.log(' Successfully converted changelog to Mintlify format');

} catch (error) {
  console.error(' Error:', error.message);
  process.exit(1);
}