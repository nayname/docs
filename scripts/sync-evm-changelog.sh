#!/bin/bash

# Script to manually trigger the EVM changelog sync workflow
# This simulates the repository_dispatch event from cosmos/evm repo
# Usage: ./scripts/sync-evm-changelog.sh <release-tag>
# Example: ./scripts/sync-evm-changelog.sh v0.1.0

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if release tag is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Release tag is required${NC}"
    echo "Usage: $0 <release-tag>"
    echo "Example: $0 v0.1.0"
    exit 1
fi

RELEASE_TAG=$1

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

echo -e "${YELLOW}Triggering EVM changelog sync for release: ${RELEASE_TAG}${NC}"

# Two options for triggering:
echo "Choose how to trigger the workflow:"
echo "1. Via workflow_dispatch (direct trigger)"
echo "2. Via repository_dispatch (simulates cosmos/evm trigger)"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo -e "${YELLOW}Triggering via workflow_dispatch...${NC}"
        gh workflow run sync-evm-changelog.yml \
            --field release_tag="$RELEASE_TAG"
        ;;
    2)
        echo -e "${YELLOW}Triggering via repository_dispatch (simulating cosmos/evm release)...${NC}"
        
        # Create the repository dispatch event
        gh api /repos/cosmos/docs/dispatches \
            --method POST \
            --field event_type="evm-release" \
            --field client_payload="{
                \"tag_name\": \"$RELEASE_TAG\",
                \"release_name\": \"EVM Release $RELEASE_TAG\",
                \"release_url\": \"https://github.com/cosmos/evm/releases/tag/$RELEASE_TAG\",
                \"repository\": \"cosmos/evm\"
            }"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Workflow triggered successfully!${NC}"
    echo ""
    echo "You can view the workflow runs at:"
    echo "https://github.com/cosmos/docs/actions/workflows/sync-evm-changelog.yml"
    echo ""
    echo "Or check the status with:"
    echo "gh run list --workflow=sync-evm-changelog.yml --limit 1"
else
    echo -e "${RED}✗ Failed to trigger workflow${NC}"
    exit 1
fi