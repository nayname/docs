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

EVM_REPO="https://github.com/evmos/ethermint.git"  # or whichever evm repo you're using
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

# Update the OpenAPI generator config to use the new proto sources
echo ""
echo "📝 Updating OpenAPI generator configuration..."
cat > "$SCRIPT_DIR/openapi-gen/config.yaml" << EOF
# OpenAPI Generation Configuration
name: "Cosmos SDK & EVM API Documentation"
version: "1.0.0"

# Local protobuf source directories
proto_source_dirs:
  - "proto-sources/cosmos-sdk"
  - "proto-sources/evm"

# Generation settings
generation:
  auto_generate_pages: true

# Server configurations for documentation
servers:
  cosmos_rest:
    - url: "https://rest.cosmos.network"
      description: "Cosmos REST Mainnet"
    - url: "https://testnet-rest.cosmos.network"
      description: "Cosmos REST Testnet"
    - url: "http://localhost:1317"
      description: "Local Development"

  cosmos_grpc:
    - url: "https://grpc.cosmos.network:9090"
      description: "Cosmos gRPC Mainnet"
    - url: "https://testnet-grpc.cosmos.network:9090"
      description: "Cosmos gRPC Testnet"
    - url: "http://localhost:9090"
      description: "Local Development"

# Method categorization for better organization
categories:
  core:
    - "bank"
    - "auth"
    - "staking"
    - "distribution"
    - "slashing"
    - "gov"

  advanced:
    - "authz"
    - "feegrant"
    - "group"
    - "nft"
    - "upgrade"
    - "evidence"

  evm:
    - "evm"
    - "feemarket"

# Documentation metadata
metadata:
  title: "Cosmos SDK & EVM API Documentation"
  description: "Complete API reference for Cosmos SDK and EVM functionality"
  contact:
    name: "Documentation Team"
    url: "https://docs.cosmos.network"
EOF

echo "Configuration updated"

# Regenerate API documentation
echo ""
echo "Regenerating API documentation..."
cd "$PROJECT_ROOT"
bash "$SCRIPT_DIR/openapi-gen/run_complete_generation.sh"

echo ""
echo "Sync and regeneration complete!"