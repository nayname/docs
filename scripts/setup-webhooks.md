# Setting up OpenAPI Sync Webhooks

This guide explains how to configure automatic OpenAPI regeneration when source repositories change.

## Overview

The OpenAPI sync system monitors changes in source repositories (like `cosmos/evm`, `cosmos/cosmos-sdk`) and automatically regenerates API documentation when relevant files are modified.

## Setup Process

### 1. Configure Repository Webhooks

For each source repository, add a webhook that triggers the documentation update:

#### Webhook Configuration
- **Payload URL**: `https://api.github.com/repos/cosmos/docs/dispatches`
- **Content Type**: `application/json`
- **Secret**: Set to your `OPENAPI_WEBHOOK_SECRET`
- **Events**: Select "Push" events
- **Active**:  Enabled

#### Webhook Payload Example
```json
{
  "event_type": "openapi-update",
  "client_payload": {
    "repository": "cosmos/evm",
    "source": "cosmos-evm",
    "ref": "main",
    "commit": "abc123...",
    "modified_files": [
      "x/evm/types/query.proto",
      "rpc/apis/eth.go"
    ]
  }
}
```

### 2. GitHub Secrets Configuration

Add these secrets to the documentation repository:

```bash
# Repository secrets in cosmos/docs
OPENAPI_WEBHOOK_SECRET=your-webhook-secret-here
SLACK_WEBHOOK_URL=https://hooks.slack.com/...  # Optional
```

### 3. Source Repository Integration

For each source repository, add a GitHub Action that triggers the webhook:

#### `.github/workflows/trigger-docs-update.yml`
```yaml
name: Trigger Docs Update

on:
  push:
    branches: [main]
    paths:
      - 'x/evm/types/*.proto'
      - 'rpc/apis/*.go'
      - 'proto/**/*.proto'

jobs:
  trigger-docs:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger documentation update
        uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.DOCS_TRIGGER_TOKEN }}
          repository: cosmos/docs
          event-type: openapi-update
          client-payload: |
            {
              "repository": "${{ github.repository }}",
              "source": "cosmos-evm",
              "ref": "${{ github.ref }}",
              "commit": "${{ github.sha }}",
              "modified_files": ${{ toJson(github.event.commits[0].modified) }}
            }
```

### 4. Manual Triggering

You can manually trigger OpenAPI regeneration:

#### Via GitHub UI
1. Go to Actions tab in the docs repository
2. Select "OpenAPI Sync" workflow
3. Click "Run workflow"
4. Optionally specify a source to update

#### Via GitHub CLI
```bash
# Update all sources
gh workflow run openapi-sync.yml

# Update specific source
gh workflow run openapi-sync.yml -f source=cosmos-evm
```

#### Via API
```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/cosmos/docs/dispatches \
  -d '{
    "event_type": "openapi-update",
    "client_payload": {
      "repository": "cosmos/evm",
      "source": "cosmos-evm"
    }
  }'
```

## Configuration

### Adding New Sources

To monitor a new repository:

1. Update `scripts/openapi-gen/config.yaml`:
```yaml
sources:
  my-new-source:
    repo: "cosmos/my-chain"
    branch: "main"
    paths:
      - "x/*/types/*.proto"
      - "rpc/**/*.go"
    output: "docs/api-specs/my-chain.json"
    type: "grpc-gateway"
```

2. Add webhook configuration to the source repository
3. Update the allowed repositories list in the config

### Customizing Generation

You can customize what gets generated:

```yaml
generation:
  auto_generate_pages: true
  code_examples:
    - curl
    - typescript
    - go
    - rust
    - python
  cli_examples:
    - cosmos-cli
    - direct-rpc
```

## Monitoring

### Workflow Status
- Check the Actions tab for workflow runs
- Review PR descriptions for change summaries
- Monitor Slack notifications (if configured)

### Debugging
- Check workflow logs for generation errors
- Verify webhook payloads in repository settings
- Test manual triggers to isolate issues

## Security

### Webhook Security
- Always use webhook secrets
- Verify signatures in the workflow
- Limit webhook access to specific repositories

### Token Permissions
- Use fine-grained personal access tokens
- Limit scope to necessary repositories
- Rotate tokens regularly

## Best Practices

1. **Test Changes**: Always review generated PRs before merging
2. **Monitor File Sizes**: Large OpenAPI specs may need optimization
3. **Version Control**: Tag releases when major API changes occur
4. **Documentation**: Keep this setup guide updated
5. **Backup**: Maintain manual generation capabilities