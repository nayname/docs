# Documentation Hub for Cosmos Stack

Central documentation hub for the Cosmos Stack.

Created using Mintlify and OpenAPI.

## Quick Start

### Prerequisites

- **Node.js** v19+
- **Python** 3.8+ (for API documentation maintenance)
- **Git**

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run locally:**
   ```bash
   npx mint dev
   ```

3. **Open browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## OpenAPI Documentation Maintenance

The API Reference relies on automatically generated REST API documentation from Cosmos SDK and EVM protobuf definitions. The source files should be regenerated whenever network upgrades modify or introduce additional methods.

### Regenerate API docs

To regenerate all API documentation after a network update:

```bash
# 1. Sync latest protobuf definitions
./scripts/sync-protos.sh

# 2. Regenerate OpenAPI specifications
python3 scripts/generate-openapi-specs.py

# 3. Regenerate interactive documentation pages
npx @mintlify/scraping@latest openapi-file docs/api-specs/cosmos-sdk-complete.json -o docs/api-reference/cosmos-rest

# 4. Update navigation (if new endpoints were added)
# Edit docs.json to include any new endpoint pages
```

### Detailed Steps

#### 1. Sync Protobuf Sources

```bash
# Make script executable (first time only)
chmod +x scripts/sync-protos.sh

# Sync protobuf files from upstream repositories
./scripts/sync-protos.sh
```

Creates `proto-sources/` directory with:
- **Cosmos SDK protos**: From `cosmos/cosmos-sdk`
- **EVM protos**: From `evmos/ethermint`

#### 2. Generate OpenAPI Specifications

```bash
# Setup Python environment (first time only)
python3 -m venv openapi_venv
source openapi_venv/bin/activate
pip install pyyaml requests protobuf

# Generate specifications
python3 scripts/generate-openapi-specs.py
```

Produces:
- `docs/api-specs/cosmos-sdk-complete.json` (151KB+ comprehensive spec)
- `docs/api-specs/cosmos-sdk-complete.yaml` (YAML format)

#### 3. Generate Interactive Documentation

```bash
# Clean existing documentation (optional)
rm -rf docs/api-reference/cosmos-rest/*

# Generate 100+ interactive endpoint pages
npx @mintlify/scraping@latest openapi-file docs/api-specs/cosmos-sdk-complete.json -o docs/api-reference/cosmos-rest
```

#### 4. Update Navigation Structure

Add any new endpoints to the layout in `docs.json`:

```json
{
  "navigation": [
    {
      "group": "REST API Reference",
      "pages": [
        "api-reference/cosmos-rest",
        {
          "group": "Core Modules",
          "pages": [
            "api-reference/cosmos-rest/bank/query-all-balances"
            // Add new endpoints here
          ]
        }
      ]
    }
  ]
}
```

### API Coverage

**Core Modules:** Auth, Bank, Staking, Distribution, Governance (Gov, Authz), Transaction handling

**EVM Integration:** EVM state and execution, Fee market mechanisms, JSON-RPC compatibility

**Advanced Features:** Fee grants, Group operations, Vesting, NFT, Protocol pool, IBC and cross-chain functionality

### Troubleshooting

**Repository access issues:**
```bash
curl -s https://api.github.com/repos/cosmos/cosmos-sdk | jq .name
curl -s https://api.github.com/repos/evmos/ethermint | jq .name
```

**Python environment issues:**
```bash
pip install --upgrade pyyaml requests protobuf
```

**Mintlify issues:**
```bash
# Update CLI
npm install -g @mintlify/scraping@latest

# Validate OpenAPI spec
mint openapi-check docs/api-specs/cosmos-sdk-complete.json
```

## Contributing

### Development Workflow

1. **Fork and branch:**
   ```bash
   git checkout -b feature/your-change
   ```

2. **Make changes** under `docs/`

3. **Validate:**
   ```bash
   mint broken-links
   ```

4. **Submit:**
   ```bash
   git add .
   git commit -m "Describe your change"
   git push origin feature/your-change
   ```

5. **Open pull request** against `main`

### Useful Commands

```bash
# Check for broken links (run before pushing)
mint broken-links

# Rename files and update references automatically
mint rename <oldName> <newName>

# Validate OpenAPI specification
mint openapi-check <file-or-url>
```

## Project Structure

```
docs/
├── api-reference/           # Interactive API documentation
│   ├── cosmos-rest/        # Generated REST API pages (109 endpoints)
│   └── evm/               # EVM-specific documentation
├── api-specs/             # OpenAPI specifications
│   ├── cosmos-sdk-complete.json    # Main OpenAPI spec (151KB)
│   └── cosmos-sdk-complete.yaml    # YAML format
├── docs/                  # Manual documentation
│   ├── evm/              # EVM developer guides
│   ├── ibc/              # IBC documentation
│   └── sdk/              # Cosmos SDK guides
├── scripts/               # Maintenance scripts
│   ├── sync-protos.sh     # Sync protobuf definitions
│   └── generate-openapi-specs.py  # Generate OpenAPI specs
├── snippets/              # Reusable components
└── docs.json             # Navigation configuration
```

---

Built with [Mintlify](https://mintlify.com/docs). Contribute by [making a PR](https://github.com/cosmos/docs/compare).
