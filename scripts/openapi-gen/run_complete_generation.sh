#!/bin/bash

# Complete OpenAPI Generation Script for Cosmos EVM
# This script runs method discovery and generates comprehensive OpenAPI specs

set -e

# Configuration
RPC_URL="${RPC_URL:-http://localhost:8545}"
OUTPUT_DIR="docs/api-specs"
PAGES_DIR="docs/api-reference/evm"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Cosmos EVM OpenAPI Generation"
echo "================================================"

# Check if node is running
echo "📡 Checking RPC endpoint: $RPC_URL"
if ! curl -s -f -X POST "$RPC_URL" -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' > /dev/null; then
    echo "❌ RPC endpoint is not responding. Please ensure your node is running."
    echo "   You can start a local node with: ./local_node.sh"
    exit 1
fi
echo "✅ RPC endpoint is responding"

# Step 1: Discover supported methods
echo ""
echo "🔍 Step 1: Discovering supported methods..."
python3 "$SCRIPT_DIR/method_discovery.py" \
    --rpc-url "$RPC_URL" \
    --output "$OUTPUT_DIR/compatibility_report.md" \
    --json-output "$OUTPUT_DIR/method_discovery.json" \
    --timeout 10 \
    --workers 5

if [ $? -eq 0 ]; then
    echo "✅ Method discovery completed"
else
    echo "❌ Method discovery failed"
    exit 1
fi

# Step 2: Generate comprehensive OpenAPI spec
echo ""
echo "📝 Step 2: Generating OpenAPI specification..."
python3 "$SCRIPT_DIR/enhanced_generator.py" \
    --config "$SCRIPT_DIR/config.yaml" \
    --discovery "$OUTPUT_DIR/method_discovery.json" \
    --output "$OUTPUT_DIR/cosmos-evm-complete.json" \
    --generate-pages \
    --pages-dir "$PAGES_DIR"

if [ $? -eq 0 ]; then
    echo "✅ OpenAPI specification generated"
else
    echo "❌ OpenAPI generation failed"
    exit 1
fi

# Step 3: Generate compatibility matrix
echo ""
echo "📊 Step 3: Generating compatibility matrix..."
python3 - << 'EOF'
import json
import sys

# Load discovery data
with open('docs/api-specs/method_discovery.json', 'r') as f:
    data = json.load(f)

supported = data['supported']
unsupported = data['unsupported']

# Generate compatibility matrix
print("# Cosmos EVM JSON-RPC Compatibility Matrix")
print("")
print("| Method | Status | Category | Min Geth Version | Notes |")
print("|--------|--------|----------|------------------|-------|")

# Supported methods
for method, info in sorted(supported.items()):
    status = "✅ Supported"
    category = info.get('category', 'Unknown')
    version = info.get('min_geth_version', 'N/A')
    notes = info.get('message', '')
    print(f"| `{method}` | {status} | {category} | {version} | {notes} |")

# Unsupported methods
for method, info in sorted(unsupported.items()):
    status = "❌ Unsupported"
    category = info.get('category', 'Unknown')
    version = info.get('min_geth_version', 'N/A')
    notes = info.get('error_message', '')
    print(f"| `{method}` | {status} | {category} | {version} | {notes} |")

print("")
print(f"**Summary:** {len(supported)} supported, {len(unsupported)} unsupported")
EOF

# Step 4: Validate generated OpenAPI spec
echo ""
echo "🔍 Step 4: Validating OpenAPI specification..."
if command -v openapi-generator-cli &> /dev/null; then
    openapi-generator-cli validate -i "$OUTPUT_DIR/cosmos-evm-complete.json"
    if [ $? -eq 0 ]; then
        echo "✅ OpenAPI specification is valid"
    else
        echo "⚠️  OpenAPI specification has validation warnings"
    fi
else
    echo "⚠️  openapi-generator-cli not found, skipping validation"
fi

# Step 5: Generate client SDKs (optional)
echo ""
echo "📦 Step 5: Generating client SDKs..."
SDK_OUTPUT_DIR="generated-sdks"
mkdir -p "$SDK_OUTPUT_DIR"

if command -v openapi-generator-cli &> /dev/null; then
    # Generate TypeScript client
    echo "  📦 Generating TypeScript client..."
    openapi-generator-cli generate \
        -i "$OUTPUT_DIR/cosmos-evm-complete.json" \
        -g typescript-axios \
        -o "$SDK_OUTPUT_DIR/typescript" \
        --additional-properties=npmName=cosmos-evm-client,npmVersion=1.0.0

    # Generate Python client
    echo "  📦 Generating Python client..."
    openapi-generator-cli generate \
        -i "$OUTPUT_DIR/cosmos-evm-complete.json" \
        -g python \
        -o "$SDK_OUTPUT_DIR/python" \
        --additional-properties=packageName=cosmos_evm_client,packageVersion=1.0.0

    # Generate Go client
    echo "  📦 Generating Go client..."
    openapi-generator-cli generate \
        -i "$OUTPUT_DIR/cosmos-evm-complete.json" \
        -g go \
        -o "$SDK_OUTPUT_DIR/go" \
        --additional-properties=packageName=cosmosevmclient

    echo "✅ Client SDKs generated in $SDK_OUTPUT_DIR/"
else
    echo "⚠️  openapi-generator-cli not found, skipping SDK generation"
    echo "   Install with: npm install -g @openapitools/openapi-generator-cli"
fi

# Step 6: Generate testing collection
echo ""
echo "🧪 Step 6: Generating Postman collection..."
python3 - << 'EOF'
import json

# Load discovery data
with open('docs/api-specs/method_discovery.json', 'r') as f:
    data = json.load(f)

# Generate Postman collection
collection = {
    "info": {
        "name": "Cosmos EVM JSON-RPC API",
        "description": "Generated collection for testing Cosmos EVM JSON-RPC methods",
        "version": "1.0.0"
    },
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:8545",
            "type": "string"
        }
    ],
    "item": []
}

# Add supported methods
for method, info in data['supported'].items():
    item = {
        "name": method,
        "request": {
            "method": "POST",
            "header": [
                {
                    "key": "Content-Type",
                    "value": "application/json"
                }
            ],
            "body": {
                "mode": "raw",
                "raw": json.dumps({
                    "jsonrpc": "2.0",
                    "method": method,
                    "params": info.get('test_params', []),
                    "id": 1
                }, indent=2)
            },
            "url": {
                "raw": "{{baseUrl}}",
                "host": ["{{baseUrl}}"]
            }
        },
        "response": []
    }
    collection["item"].append(item)

# Write collection
with open('docs/api-specs/cosmos-evm-postman.json', 'w') as f:
    json.dump(collection, f, indent=2)

print("✅ Postman collection generated")
EOF

# Summary
echo ""
echo "🎉 OpenAPI Generation Complete!"
echo "================================================"
echo "📄 Files generated:"
echo "  - docs/api-specs/cosmos-evm-complete.json (OpenAPI spec)"
echo "  - docs/api-specs/compatibility_report.md (Compatibility report)"
echo "  - docs/api-specs/method_discovery.json (Discovery data)"
echo "  - docs/api-specs/cosmos-evm-postman.json (Postman collection)"
echo "  - docs/api-reference/evm/*.mdx (Method documentation pages)"
if [ -d "generated-sdks" ]; then
    echo "  - generated-sdks/ (Client SDKs)"
fi

echo ""
echo "📊 Results:"
SUPPORTED_COUNT=$(python3 -c "import json; data=json.load(open('docs/api-specs/method_discovery.json')); print(len(data['supported']))")
TOTAL_COUNT=$(python3 -c "import json; data=json.load(open('docs/api-specs/method_discovery.json')); print(data['summary']['total_tested'])")
echo "  - $SUPPORTED_COUNT/$TOTAL_COUNT methods supported"

echo ""
echo "🚀 Next steps:"
echo "  1. Review compatibility_report.md for method details"
echo "  2. Import cosmos-evm-postman.json into Postman for testing"
echo "  3. Use the generated SDKs in your applications"
echo "  4. Deploy the OpenAPI spec to your documentation site"

echo ""
echo "✅ Done!"