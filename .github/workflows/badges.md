# 🏷️ GitHub Actions Status Badges

Add these badges to your main README.md file to display the current status of your test workflows.

## Main Test Suite Status

```markdown
[![Test Suite](https://github.com/OWNER/eleno/actions/workflows/test.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test.yml)
```

## Quick PR Checks Status

```markdown
[![PR Checks](https://github.com/OWNER/eleno/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/pr-checks.yml)
```

## Performance Monitoring Status

```markdown
[![Performance Tests](https://github.com/OWNER/eleno/actions/workflows/test-performance.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test-performance.yml)
```

## Subscription Tests Status

```markdown
[![Subscription Tests](https://github.com/OWNER/eleno/actions/workflows/test.subscriptions.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test.subscriptions.yml)
```

## All Status Badges Combined

```markdown
[![Test Suite](https://github.com/OWNER/eleno/actions/workflows/test.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test.yml)
[![PR Checks](https://github.com/OWNER/eleno/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/pr-checks.yml)
[![Performance Tests](https://github.com/OWNER/eleno/actions/workflows/test-performance.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test-performance.yml)
[![Subscription Tests](https://github.com/OWNER/eleno/actions/workflows/test.subscriptions.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test.subscriptions.yml)
```

## Custom Status Table

```markdown
| Workflow | Status | Purpose |
|----------|--------|---------|
| Test Suite | [![Test Suite](https://github.com/OWNER/eleno/actions/workflows/test.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test.yml) | Comprehensive testing on push/PR |
| PR Checks | [![PR Checks](https://github.com/OWNER/eleno/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/pr-checks.yml) | Quick validation for PRs |
| Performance | [![Performance Tests](https://github.com/OWNER/eleno/actions/workflows/test-performance.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test-performance.yml) | Performance monitoring |
| Subscriptions | [![Subscription Tests](https://github.com/OWNER/eleno/actions/workflows/test.subscriptions.yml/badge.svg)](https://github.com/OWNER/eleno/actions/workflows/test.subscriptions.yml) | Payment flow testing |
```

## Instructions

1. Replace `OWNER` with your GitHub username or organization name
2. Update repository name if different from `eleno`
3. Add the badges to your main README.md file
4. Commit and push to see the badges in action

## Badge Options

GitHub Actions badges support several parameters:

- `?branch=main` - Show status for specific branch
- `?event=push` - Show status for specific event type

Example with branch specification:
```markdown
[![Test Suite](https://github.com/OWNER/eleno/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/OWNER/eleno/actions/workflows/test.yml)
```