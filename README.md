# Cosmos Documentation System

A comprehensive documentation system for Cosmos SDK and Cosmos EVM chains, built with [Mintlify](https://mintlify.com).

## 🏗️ System Architecture

### Landing Page Configuration
- **Default Landing Page**: `docs/index.mdx` serves as the main entry point
- **Navigation Structure**: Fully nested, collapsible sidebar navigation
- **Redirect Setup**: Root URL (`/`) automatically redirects to `/docs/index`

### Documentation Structure

```
docs/
├── index.mdx                    # Main landing page
├── evm/                         # EVM documentation
│   ├── index.mdx               # EVM overview
│   ├── developers/             # Developer guides
│   │   ├── smart-contracts/    # Contract development
│   │   ├── tooling-and-resources/ # Development tools
│   │   └── precompiles/        # Precompiled contracts
├── api-reference/              # API documentation
│   ├── cosmos-rest/            # REST API endpoints (113 endpoints)
│   │   ├── vm/                 # EVM virtual machine
│   │   ├── erc20/              # ERC20 token module
│   │   ├── feemarket/          # Fee market management
│   │   ├── precisebank/        # Precise banking
│   │   └── [29 other modules]  # Core Cosmos SDK modules
│   └── evm-jsonrpc/           # EVM JSON-RPC API
│       ├── index.mdx           # Complete JSON-RPC reference
│       └── eth/                # Ethereum-compatible methods
└── api-specs/                  # OpenAPI specifications
    ├── cosmos-sdk-complete.json # Complete REST API spec (155KB)
    └── cosmos-evm-jsonrpc.json  # EVM JSON-RPC spec (6KB)
```

## 🚀 Quick Start

### Development Server
```bash
npx mintlify dev
```

### Production Build
```bash
npx mintlify build
```

### Service Management
```bash
# Start documentation service
systemctl start mint-docs

# Restart after changes
systemctl restart mint-docs

# Check status
systemctl status mint-docs
```

## 📊 API Coverage

### REST API (113 Endpoints)
- **Core Modules**: 29 Cosmos SDK modules
- **EVM Modules**: 4 specialized modules (vm, feemarket, erc20, precisebank)
- **Interactive Documentation**: Full Mintlify integration with code samples
- **Source**: Generated from `cosmos/evm` repository protobuf definitions

### JSON-RPC API
- **Ethereum Compatibility**: Full Ethereum JSON-RPC specification
- **Method Categories**: eth, net, web3, debug, txpool namespaces
- **WebSocket Support**: Real-time subscriptions (eth_subscribe/unsubscribe)
- **Development Tools**: MetaMask, Hardhat, Foundry compatibility

## 🔧 Maintenance Workflows

### Update REST API Documentation

1. **Sync Protocol Buffers**:
   ```bash
   ./scripts/sync-protos.sh
   ```

2. **Generate OpenAPI Specifications**:
   ```bash
   python scripts/generate-openapi-specs.py
   ```

3. **Generate Interactive Documentation**:
   ```bash
   npx @mintlify/scraping@latest openapi-file docs/api-specs/cosmos-sdk-complete.json -o docs/api-reference/cosmos-rest
   ```

4. **Update Navigation** (automatic via Mintlify scraper output)

### Update EVM JSON-RPC Documentation

1. **Extract Methods**:
   ```bash
   python scripts/extract-jsonrpc-methods.py
   ```

2. **Generate Documentation**:
   ```bash
   npx @mintlify/scraping@latest openapi-file docs/api-specs/cosmos-evm-jsonrpc.json -o docs/api-reference/evm-jsonrpc
   ```

### Configuration Management

- **docs.json**: Main configuration with nested navigation
- **Landing page**: Automatic redirect from root to `/docs/index`
- **API Integration**: OpenAPI specs with multiple server endpoints
- **Environment**: Python virtual environments for generation scripts

## 🎨 Customization

### Theme Configuration
```json
{
  "theme": "palm",
  "colors": {
    "primary": "#4B47CA",
    "light": "#39A6A3",
    "dark": "#22E2A8"
  }
}
```

### Navigation Features
- **Collapsible Groups**: All directory structures are collapsible
- **Icon Integration**: Lucide icon library
- **External Links**: GitHub, Discord, Blog integration
- **Search**: Contextual search with custom prompts

### API Integration
- **Multiple Servers**: Mainnet, testnet, local development
- **Authentication**: Support for various auth methods
- **Code Examples**: Multi-language code samples
- **Interactive Playground**: Test API endpoints directly

## 🛠️ Development Tools

### Dependencies
```bash
# Python dependencies for generators
pip install pyyaml requests protobuf

# Node.js dependencies
npm install -g @mintlify/scraping
```

### File Generation
- **Protobuf Sync**: Automated repository synchronization
- **OpenAPI Generation**: Python-based spec generation
- **Documentation Scraping**: Mintlify automatic page generation
- **Navigation Updates**: Automated hierarchy creation

### Quality Assurance
- **JSON Validation**: Automatic syntax checking
- **Path Verification**: File existence validation
- **Link Checking**: Navigation integrity
- **Content Validation**: Mintlify parsing verification

## 📈 Performance & Optimization

### Generated Assets
- **REST API Spec**: 155KB optimized OpenAPI 3.0
- **JSON-RPC Spec**: 6KB focused specification
- **Interactive Pages**: 113 REST + 2 JSON-RPC endpoints
- **Navigation Tree**: Fully nested, performant structure

### Caching Strategy
- **Static Assets**: Long-term caching
- **API Responses**: Contextual caching
- **Build Optimization**: Incremental updates
- **CDN Integration**: Global content delivery

## 🔍 Troubleshooting

### Common Issues

1. **Missing File Warnings**:
   ```bash
   # Check for old navigation references
   grep -r "docs/api-reference" docs.json

   # Verify file existence
   find docs/api-reference -name "*.mdx" | sort
   ```

2. **JSON Syntax Errors**:
   ```bash
   python3 -m json.tool docs.json
   ```

3. **Mintlify Parsing Errors**:
   ```bash
   # Check for invalid React components
   grep -r "import React" docs/

   # Validate OpenAPI specs
   npx swagger-codegen-cli validate -i docs/api-specs/cosmos-sdk-complete.json
   ```

4. **Service Issues**:
   ```bash
   # Check service logs
   systemctl status mint-docs
   journalctl -u mint-docs -f
   ```

### File Structure Validation
```bash
# Verify all navigation references exist
python3 -c "
import json
import os
with open('docs.json') as f:
    config = json.load(f)
# Add validation logic here
"
```

## 🌐 Deployment

### Production Configuration
- **Custom Domain**: Configured via Mintlify dashboard
- **SSL/TLS**: Automatic certificate management
- **CDN**: Global content distribution
- **Analytics**: Integrated tracking and monitoring

### Environment Variables
```bash
# API endpoints
COSMOS_REST_URL=https://rest.cosmos.network
COSMOS_TESTNET_REST_URL=https://testnet-rest.cosmos.network
EVM_RPC_URL=https://evm-rpc.cosmos.network
```

### Monitoring
- **Build Status**: Automated deployment checks
- **Performance**: Page load monitoring
- **API Availability**: Endpoint health checks
- **User Analytics**: Documentation usage metrics

## 📚 Resources

- **Mintlify Documentation**: https://mintlify.com/docs
- **Cosmos SDK**: https://docs.cosmos.network
- **EVM Module**: https://github.com/cosmos/evm
- **OpenAPI Specification**: https://swagger.io/specification/

## 🤝 Contributing

1. **Setup Development Environment**
2. **Run Quality Checks**
3. **Test Documentation Changes**
4. **Submit Pull Request**

For detailed contribution guidelines, see our development workflow above.

---

**Last Updated**: June 2025
**Documentation Version**: 1.0.0
**API Coverage**: 113 REST endpoints + Full JSON-RPC compatibility
