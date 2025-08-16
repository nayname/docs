# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a Mintlify-based documentation site for the Cosmos ecosystem. The repository contains documentation, API references, and comprehensive test suites for Cosmos precompiled contracts.

## Commands

### Development
- `npm run dev` or `npx mint dev` - Start the Mintlify development server with live-reload
- `npx mint broken-links` - Check for broken internal links
- `npx mint openapi-check path/to/openapi.yaml` - Validate OpenAPI specifications

### Testing Precompiles
Navigate to the `tests/` directory first:
- `cd tests && npm install` - Install test dependencies
- `cd tests && npm test` - Run all precompile tests
- `cd tests && npm run test:bank` - Run specific precompile tests (bank, staking, distribution, etc.)
- `cd tests && ./run-tests.sh` - Run all tests with shell script

### Changelog Management
- `./scripts/rebuild-changelog.sh` - Rebuild full changelog history from all tags
- `./scripts/sync-single-changelog.sh v0.1.0` - Add individual tag to release notes

## Architecture

### Documentation Structure
- **docs.json** - Mintlify configuration defining navigation structure and site settings
- **docs/** - Main documentation content organized by:
  - `documentation/` - Core documentation (concepts, SDK, smart contracts)
  - `api-reference/` - Ethereum JSON-RPC API documentation with OpenAPI specs
  - `changelog/` - Auto-generated release notes

### Content Organization
- **Concepts** (docs/documentation/concepts/) - Core blockchain concepts like accounts, gas, IBC, mempool, transactions
- **Cosmos SDK** (docs/documentation/cosmos-sdk/) - SDK integration, CLI, protocol details, and modules
- **Smart Contracts** (docs/documentation/smart-contracts/) - Precompiles and predeployed contracts documentation
- **Precompiles** - Documented at specific addresses (Bank: 0x804, Staking: 0x800, Distribution: 0x801, etc.)

### Testing Infrastructure
- **tests/precompiles/** - Comprehensive test suite for all precompiled contracts
- Tests verify documentation accuracy against actual devnet implementation
- Each precompile test includes query methods, transaction methods, gas measurements, error handling

### Key Files for Context
- **docs/documentation/concepts/mempool.mdx** - Recently edited, contains mempool documentation
- **docs/documentation/cosmos-sdk/integrate.mdx** - Recently edited, SDK integration guide
- **tests/config.js** - Test configuration with network endpoints and account settings

## Documentation Standards
- Use Mintlify MDX format with proper frontmatter
- Follow existing file structure and naming conventions
- Validate all Markdown and ensure links resolve
- Check for broken links before committing changes