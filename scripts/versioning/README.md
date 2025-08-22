# Version Management System

## Overview
The version management system provides a complete workflow for freezing documentation versions and creating new development versions. This process is typically executed when a new version of cosmos/evm is released, ensuring the documentation aligns with the released code.

## Scripts and Integration

### Main Script
- **`version-manager.sh`** - Orchestrates the entire version freeze process

### Supporting Scripts
1. **`refresh-release-notes.sh`** - Fetches latest changelog from cosmos/evm
2. **`parse-evm-changelog.js`** - Converts CHANGELOG.md to Mintlify format
3. **`snapshot-eip-data.js`** - Captures current EIP compatibility data from Google Sheets
4. **`generate-simple-eip-mdx.js`** - Creates static MDX with embedded EIP data
5. **`update-versions.js`** - Updates versions.json registry
6. **`update-navigation.js`** - Updates docs.json navigation structure
7. **`restructure-navigation.js`** - Cleans up navigation organization

## Version Freeze Workflow

When you run `./scripts/versioning/version-manager.sh`, it performs these steps:

### 1. Version Detection
- Reads current development version from `versions.json`
- Prompts for new development version

### 2. Release Notes Update
- Checks if current version exists in release notes
- Runs `refresh-release-notes.sh` to fetch from latest release tag
- Uses `parse-evm-changelog.js` to convert to Mintlify format
- Automatically detects the latest release from GitHub API

### 3. Documentation Freeze
- Copies `docs/` to `<version>/` directory
- Creates version metadata files

### 4. EIP Data Snapshot
- Runs `snapshot-eip-data.js` to capture current Google Sheets data
- Temporarily saves to `<version>/eip-data-snapshot.json`
- Runs `generate-simple-eip-mdx.js` to create static MDX page with embedded data
- Cleans up the temporary JSON file after embedding

### 5. Link Updates
- Updates all internal links from `/docs/` to `/<version>/`
- Preserves snippet imports pointing to `/snippets/`

### 6. Registry Updates
- Updates `versions.json` with new development version
- Updates `docs.json` navigation structure
- Optionally restructures navigation for clarity

## Usage

### Freeze Current Version and Start New Development
```bash
./scripts/versioning/version-manager.sh
```
This will:
- Freeze the current version (e.g., v0.4.x)
- Prompt for new version (e.g., v0.5.0)
- Update all configurations

### Manual Operations

#### Update Release Notes Only
```bash
# Fetch from latest release (default)
./scripts/versioning/refresh-release-notes.sh

# Or fetch from specific version/branch
./scripts/versioning/refresh-release-notes.sh v0.4.1
./scripts/versioning/refresh-release-notes.sh main
```

#### Snapshot EIP Data Only
```bash
node scripts/versioning/snapshot-eip-data.js <version>
```

#### Generate Static EIP Page
```bash
node scripts/versioning/generate-simple-eip-mdx.js <version>
```

## File Structure After Freeze

```
/
├── docs/                    # Current development (e.g., v0.5.0)
│   └── documentation/
│       └── evm-compatibility/
│           └── eip-reference.mdx  # Dynamic, fetches from Google Sheets
├── v0.4.x/                  # Frozen version
│   ├── .version-frozen      # Marker file
│   ├── .version-metadata.json
│   └── documentation/
│       └── evm-compatibility/
│           └── eip-reference.mdx  # Static, embedded data
├── versions.json            # Version registry
└── docs.json               # Navigation configuration
```

## Key Features

### EIP Data Handling
- **Development version**: Fetches live data from Google Sheets
- **Frozen versions**: Uses embedded snapshot data
- **Component**: Same UI/UX, different data source

### Release Notes
- Automatically synced from cosmos/evm CHANGELOG.md
- Converted to Mintlify Update components
- Preserves version history

### Navigation
- Each version has its own navigation structure
- Links automatically updated to version-specific paths
- Snippets remain shared across versions

## Best Practices

1. **Before Freezing**:
   - Ensure all documentation is complete
   - Review and commit any pending changes
   - Test the documentation locally

2. **Version Naming**:
   - Use semantic versioning (v0.4.0, v0.5.0)
   - Major.Minor.Patch format

3. **After Freezing**:
   - Frozen versions are immutable
   - Don't edit files in frozen directories
   - All new work happens in `docs/`

## Troubleshooting

### Release Notes Not Found
If the version isn't in cosmos/evm yet, you can:
- Continue without it (will be added later)
- Manually update release notes before freezing

### EIP Snapshot Fails
If Google Sheets is unavailable:
- The frozen version keeps the dynamic component
- Can manually create snapshot later

### Navigation Issues
Run `restructure-navigation.js` to clean up:
```bash
node scripts/versioning/restructure-navigation.js
```