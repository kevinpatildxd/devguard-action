# devguard-action

GitHub Action for [devguard](https://github.com/kevinpatildxd/devguard) — audit your Node.js + React project in CI.

Catches dependency issues, bad `.env` config, dead imports, re-render patterns, accessibility violations, and RSC boundary bugs — all in one step.

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
| `command` | Which command to run: `deps`, `env`, `react`, `react:imports`, `react:hooks`, `react:bundle`, `react:a11y`, `react:server`. Omit for full audit. | full audit |
| `strict` | Fail CI on any error | `true` |
| `json` | Output results as JSON | `false` |
| `file` | Path to a specific `.env` file (used with `env` command) | — |
| `version` | devguard version to pin (e.g. `2.0.0`). Defaults to latest. | `latest` |

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

### Only React checks

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    command: react
```

### Pin to a specific version

```yaml
- uses: kevinpatildxd/devguard-action@v1
  with:
    version: '2.0.0'
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
