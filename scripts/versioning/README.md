# Documentation Versioning System

This directory contains the unified versioning system for Cosmos EVM documentation. it automates the process of freezing documentation versions while maintaining snapshots of dynamic data like EIP compatibility tables.

## Overview

The versioning system provides:

- **Version snapshots** - Frozen versions preserve the state of documentation at release time
- **Google Sheets integration** - EIP compatibility data is snapshotted via Google Sheets tabs
- **Automated workflow** - Single command to freeze current version and prepare for next release
- **Mintlify compatibility** - Works within Mintlify's MDX compiler constraints

## Architecture

### Version Structure

```
docs/
├── next/                    # Active development (main)
│   ├── documentation/       # Current docs being edited
│   ├── api-reference/
│   └── changelog/
│
├── v0.4.x/                 # Frozen version
│   ├── .version-frozen     # Marker file with freeze date
│   ├── .version-metadata.json # Version metadata
│   ├── documentation/      # Snapshot from docs/next/ at freeze time
│   ├── api-reference/
│   └── changelog/
│
└── v0.5.0/                 # Another frozen version
    └── ...
```

### Navigation Structure

```json
{
  "navigation": {
    "versions": [
      {
        "version": "v0.4.x",  // Frozen version
        "tabs": [...],        // Points to docs/v0.4.x/ paths
      },
      {
        "version": "next",    // Active development
        "tabs": [...],        // Points to docs/next/ paths
      }
    ]
  }
}
```

## Quick Start

### Prerequisites

1. **Google Sheets API Access**
   - Service account key saved as `service-account-key.json`
   - See [GSHEET-SETUP.md](https://github.com/cosmos/docs/blob/main/scripts/versioning/GSHEET-SETUP.md) for detailed setup

2. **Install Dependencies**

   ```bash
   cd scripts/versioning
   npm install
   ```

### Freeze a Version

Run the version manager to freeze the current version and start a new one:

```bash
cd scripts/versioning
npm run freeze
```

The script will:

1. Prompt for the new development version (e.g., v0.5.0)
2. Check/update release notes from cosmos/evm
3. Create a frozen copy at the current version path
4. Snapshot EIP data to a Google Sheets tab
5. Update navigation and version registry
6. Set up the new development version

## Scripts Reference

### Core Scripts (ESM)

#### `version-manager.js`
Main orchestration script for complete version freezing workflow.

**Usage:**
```bash
npm run freeze
```

**What it does:**
- Creates frozen copy of `docs/next/` at version path
- Calls sheets-manager for Google Sheets operations
- Updates all internal links in frozen version
- Updates navigation structure and version registry
- Creates version metadata files

#### `sheets-manager.js`
Google Sheets operations for EIP data versioning.

**Usage:**
```bash
npm run sheets <version>
```

**What it does:**
- Creates version-specific tab in Google Sheets
- Copies data from main sheet to version tab
- Generates EIP reference MDX with sheetTab prop
- Handles authentication and error recovery

#### `release-notes.js`
Standalone changelog and release notes management.

**Usage:**
```bash
npm run release-notes [version|latest]
```

**What it does:**
- Fetches changelog from cosmos/evm repository
- Parses and converts to Mintlify format
- Updates release notes file in docs/next/

### Supporting Scripts

#### `test-versioning.js`
System testing and validation.

**Usage:**
```bash
npm run test
```

#### `restructure-navigation.js`
Navigation structure cleanup utility.

## Google Sheets Integration

EIP compatibility data is versioned through Google Sheets tabs. See [GSHEET-SETUP.md](https://github.com/cosmos/docs/blob/main/scripts/versioning/GSHEET-SETUP.md) for setup and configuration.

### Shared Component

The `/snippets/eip-compatibility-table.jsx` component accepts a `sheetTab` prop:

```jsx
export default function EIPCompatibilityTable({ sheetTab } = {}) {
  const url = sheetTab
    ? `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${sheetTab}&tqx=out:json`
    : `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=eip_compatibility_data&tqx=out:json`;
  // ...
}
```

### Version-Specific Usage

Frozen versions use the component with their tab:

```mdx
<EIPCompatibilityTable sheetTab="v0.4.x" />
```

Active development uses it without props (defaults to main sheet):

```mdx
<EIPCompatibilityTable />
```

## How It Works

### Version Freeze Process

1. **Preparation Phase**
   - Determine current version from versions.json
   - Prompt for new development version
   - Check/update release notes

2. **Freeze Phase**
   - Copy `docs/next/` to version directory (e.g., `docs/v0.4.x/`)
   - Create Google Sheets tab with version name
   - Copy EIP data to version tab

3. **Update Phase**
   - Generate MDX with sheet tab reference
   - Update internal links (`/docs/next/` → `/docs/v0.4.x/`)
   - Keep snippet imports unchanged (`/snippets/`)
   - Update navigation structure

4. **Finalization Phase**
   - Create `.version-frozen` marker
   - Create `.version-metadata.json`
   - Register new development version
   - Update default version

### Path Management

The system handles three types of paths:

1. **Document paths**: Updated to version-specific
   - Before: `/docs/next/documentation/concepts/accounts`
   - After: `/docs/v0.4.x/documentation/concepts/accounts`

2. **Snippet imports**: Remain unchanged (shared)
   - Always: `/snippets/icons.mdx`

3. **External links**: Remain unchanged
   - Always: `https://example.com`

## Mintlify Constraints

The system works within Mintlify's MDX compiler limitations:

### What Works ✅

- Component imports from `/snippets/`
- Props passed to components
- Standard MDX syntax
- HTML comments for metadata

### What Doesn't Work ❌

- Inline component definitions
- Dynamic imports
- JSON imports in MDX
- JavaScript expressions in MDX body
- Runtime code execution

See [Mintlify Constraints](../../CLAUDE.md) for details.

## Setup Guide

### 1. Google Sheets API Setup

Follow [GSHEET-SETUP.md](https://github.com/cosmos/docs/blob/main/scripts/versioning/GSHEET-SETUP.md) to:

1. Create a Google Cloud project
2. Enable Sheets API
3. Create service account
4. Download credentials
5. Share spreadsheet with service account

### 2. Install Dependencies

```bash
cd scripts/versioning
npm install
```

### 3. Configure Credentials

Save your service account key as:

```sh
scripts/versioning/service-account-key.json
```

### 4. Test Connection

```bash
node -e "
const { google } = require('./node_modules/googleapis');
const fs = require('fs');
const credentials = JSON.parse(fs.readFileSync('service-account-key.json'));
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
console.log('✓ Google Sheets API configured');
"
```

## Usage Examples

### Freeze Current Version

```bash
# Start the version freeze process
./scripts/versioning/version-manager.sh

# Enter new version when prompted
Enter the new development version (e.g., v0.5.0): v0.5.0

# Confirm actions
Proceed with version management? (y/n): y
```

### Update Release Notes Only

```bash
# Fetch latest release notes
./scripts/versioning/refresh-release-notes.sh latest

# Or fetch specific version
./scripts/versioning/refresh-release-notes.sh v0.4.1
```

### Manual Navigation Update

```bash
# If needed, manually update navigation for a version
npm run freeze  # Full workflow includes navigation updates
```

## Important Notes

### Version Management

- Development happens in `docs/next/` directory
- Frozen versions include `.version-frozen` marker
- Previous versions can be updated if needed

### Version Naming

- Use semantic versioning: `v0.4.0`, `v0.5.0`
- Special case: `v0.4.x` for minor version branches
- Active development is always `next` in navigation

### Google Sheets Management

- Don't delete version tabs from spreadsheet
- Main sheet (`eip_compatibility_data`) is always live
- Version tabs are permanent snapshots

### Git Workflow

```bash
# After version freeze
git add -A
git commit -m "docs: freeze v0.4.x and begin v0.5.0 development"
git push
```

## Maintenance

### Cleaning Up Test Versions

If you need to remove a test version:

```bash
# Remove frozen directory
rm -rf v0.5.0/

# Update versions.json manually or re-run version manager

# Remove navigation entry (manual edit of docs.json)
# Remove Google Sheets tab (manual via Google Sheets UI)
```

## File Structure

```
scripts/versioning/
├── README.md                     # This file
├── GSHEET-SETUP.md              # Google Sheets API setup guide
├── version-manager.js           # Main orchestration (ESM)
├── sheets-manager.js            # Google Sheets operations (ESM)
├── release-notes.js             # Changelog management (ESM)
├── test-versioning.js           # System testing (ESM)
├── restructure-navigation.js    # Navigation cleanup utility
├── package.json                 # Node dependencies with ESM support
├── package-lock.json           # Dependency lock file
└── service-account-key.json    # Google service account (git-ignored)
```

## Related Documentation

- [Main README](../../README.md) - Project overview
- [CLAUDE.md](../../CLAUDE.md) - AI assistant context
- [GSHEET-SETUP.md](https://github.com/cosmos/docs/blob/main/scripts/versioning/GSHEET-SETUP.md) - Google Sheets API setup
- [Mintlify Documentation](https://mintlify.com/docs) - MDX reference
