#!/bin/bash

# Sync Protobuf Files Script
# This script pulls the latest protobuf definitions from cosmos-sdk and evm repos
# and regenerates the API documentation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROTO_DIR="$PROJECT_ROOT/proto-sources"

# Repository configurations
COSMOS_SDK_REPO="https://github.com/cosmos/cosmos-sdk.git"
COSMOS_SDK_BRANCH="main"
COSMOS_SDK_PROTO_PATH="proto"

EVM_REPO="https://github.com/cosmos/evm.git"
EVM_BRANCH="main"
EVM_PROTO_PATH="proto"

echo "🔄 Syncing Protobuf Files"
echo "=========================="

# Function to sync protobuf files from a git repository
sync_repo_protos() {
    local repo_url="$1"
    local branch="$2"
    local proto_path="$3"
    local target_dir="$4"
    local repo_name="$(basename "$repo_url" .git)"

    echo "📥 Syncing $repo_name protos..."

    # Create temporary directory
    local temp_dir=$(mktemp -d)
    trap "rm -rf $temp_dir" EXIT

    # Clone repository (shallow clone for efficiency)
    echo "  Cloning $repo_url (branch: $branch)..."
    git clone --depth 1 --branch "$branch" "$repo_url" "$temp_dir" > /dev/null 2>&1

    # Copy protobuf files
    if [ -d "$temp_dir/$proto_path" ]; then
        echo "  Copying protobuf files to $target_dir..."
        rm -rf "$target_dir"
        mkdir -p "$target_dir"
        cp -r "$temp_dir/$proto_path"/* "$target_dir/"

        # Count copied files
        local proto_count=$(find "$target_dir" -name "*.proto" | wc -l)
        echo "  ✅ Copied $proto_count .proto files"
    else
        echo "  ❌ Protobuf directory not found: $temp_dir/$proto_path"
        return 1
    fi
}

# Sync Cosmos SDK protobuf files
sync_repo_protos "$COSMOS_SDK_REPO" "$COSMOS_SDK_BRANCH" "$COSMOS_SDK_PROTO_PATH" "$PROTO_DIR/cosmos-sdk"

# Sync EVM protobuf files
sync_repo_protos "$EVM_REPO" "$EVM_BRANCH" "$EVM_PROTO_PATH" "$PROTO_DIR/evm"

echo ""
echo "✅ Protobuf sync complete!"
echo ""
echo "🔧 Next steps:"
echo "   1. Generate OpenAPI specs: python3 scripts/generate-openapi-specs.py"
echo "   2. Generate docs: npx @mintlify/scraping@latest openapi-file docs/api-specs/cosmos-sdk-complete.json -o docs/api-reference/cosmos-rest"