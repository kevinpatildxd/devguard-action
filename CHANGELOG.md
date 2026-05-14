# Changelog

## [1.2.0]
### Added
- `working-directory` input — specify a subdirectory for monorepos
- `timeout` input — prevent CI hangs on large repos (default: 300s)
- Warning logged when `version: latest` is used (non-reproducible)
- Stderr is now captured and forwarded on failure

### Fixed
- Shell injection vulnerability in `file` input — migrated from `execSync` shell string to `execFileSync` with args array
- Score regex improved: uses last `N / 100` match to avoid false positives
- Timeout detection: reports timeout clearly instead of generic failure message

## [1.1.0]
### Added
- `scan-git` input to scan git history for committed `.env` files
- `version` input to pin a specific devguard version

## [1.0.0]
### Added
- Initial release: wraps `@kevinpatil/devguard` CLI as a GitHub Action
- Inputs: `command`, `strict`, `json`, `score`, `sarif`, `licenses`, `supply-chain`, `duplicates`, `file`
- Output: `score` (0–100)
- Published to GitHub Marketplace as "devguard audit"
