# devguard-action

GitHub Action for [devguard](https://github.com/kevinpatildxd/devguard) — audit your Node.js + React project in CI.

Catches dependency issues, bad `.env` config, dead imports, re-render patterns, accessibility violations, RSC boundary bugs, hardcoded secrets, license issues, and supply chain risks — all in one step.

## Usage

```yaml
name: devguard audit
on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: kevinpatildxd/devguard-action@v1
```

That's it. CI fails automatically if devguard finds any errors.

## Inputs

| Input | Description | Default |
|---|---|---|
| `command` | Which command to run: `deps`, `env`, `react`, `react:imports`, `react:hooks`, `react:bundle`, `react:a11y`, `react:server`, `react:secrets`. Omit for full audit. | full audit |
| `strict` | Fail CI on any error | `true` |
| `json` | Output results as JSON | `false` |
| `score` | Print health score (0–100) only, no detail output | `false` |
| `sarif` | Write a SARIF report to `devguard.sarif` for GitHub Code Scanning | `false` |
| `licenses` | Audit package licenses for copyleft and missing declarations | `false` |
| `supply-chain` | Check for install scripts, abandoned packages, and single-maintainer risk | `false` |
| `duplicates` | Detect packages installed at multiple versions | `false` |
| `scan-git` | Scan git history for accidentally committed `.env` files | `false` |
| `file` | Path to a specific `.env` file (used with `env` command) | — |
| `version` | devguard version to pin (e.g. `3.3.0`). Defaults to latest. | `latest` |

## Outputs

| Output | Description |
|---|---|
| `score` | Project health score (0–100) |

## Examples

### Full audit on every push

```yaml
- uses: kevinpatildxd/devguard-action@v1
```

### Only check environment config

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    command: env
    file: .env.production
```

### Only React checks (including secrets scan)

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    command: react
```

### Full audit with license + supply chain checks

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    licenses: true
    supply-chain: true
    duplicates: true
```

### SARIF output for GitHub Code Scanning

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    sarif: true
- uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: devguard.sarif
```

### Scan git history for leaked secrets

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    command: env
    scan-git: true
```

### Pin to a specific version

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    version: '3.3.0'
```

### JSON output (for downstream steps)

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    json: true
    strict: false
```

## How it works

The action runs `npx @kevinpatil/devguard` in your repo. No installation required — npx pulls the latest version automatically on each run.

With `strict: true` (default), the action exits with code 1 if any errors are found, blocking the merge.

## License

MIT — [Kevin Patil](https://github.com/kevinpatildxd)
