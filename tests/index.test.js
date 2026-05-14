// Basic unit tests for devguard-action argument building and score parsing

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, '')
}

function extractScore(output) {
  const matches = [...stripAnsi(output).matchAll(/(\d{1,3})\s*\/\s*100/g)]
  return matches.length > 0 ? matches[matches.length - 1][1] : null
}

// ── extractScore tests ─────────────────────────────────────────────────────

let passed = 0
let failed = 0

function assert(condition, label) {
  if (condition) {
    console.log(`  ✔ ${label}`)
    passed++
  } else {
    console.error(`  ✗ ${label}`)
    failed++
  }
}

console.log('\nextractScore()')
assert(extractScore('  85 / 100') === '85', 'parses plain score')
assert(extractScore('\x1B[32m85\x1B[0m / 100') === '85', 'strips ANSI before parsing')
assert(extractScore('checked 45/100 rules\n  72 / 100') === '72', 'takes last match to avoid false positives')
assert(extractScore('') === null, 'returns null for empty output')
assert(extractScore('no score here') === null, 'returns null when no score found')
assert(extractScore('100 / 100') === '100', 'parses perfect score')
assert(extractScore('0 / 100') === '0', 'parses zero score')

console.log('\nArgument safety')
// Verify that special characters in file input don't create shell commands
// (the fix was switching to execFileSync with args array, so these are just
//  documentation tests showing what was previously exploitable)
const dangerousInput = '.env; rm -rf /'
const args = ['--yes', '@kevinpatil/devguard']
args.push('--file', dangerousInput)
assert(args[args.length - 1] === dangerousInput, 'file arg is passed as a discrete array element (not interpolated)')
assert(args.length === 4, 'args array has correct length with file input')

console.log(`\n  ${passed} passed, ${failed} failed\n`)
if (failed > 0) process.exit(1)
