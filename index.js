const { execFileSync } = require('child_process')
const core = require('@actions/core')

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, '')
}

function extractScore(output) {
  // Match the health score line: "85 / 100" — use last match to avoid false positives
  const matches = [...stripAnsi(output).matchAll(/(\d{1,3})\s*\/\s*100/g)]
  return matches.length > 0 ? matches[matches.length - 1][1] : null
}

async function run() {
  try {
    const command          = core.getInput('command')
    const strict           = core.getInput('strict')           === 'true'
    const json             = core.getInput('json')             === 'true'
    const score            = core.getInput('score')            === 'true'
    const sarif            = core.getInput('sarif')            === 'true'
    const licenses         = core.getInput('licenses')         === 'true'
    const supplyChain      = core.getInput('supply-chain')     === 'true'
    const duplicates       = core.getInput('duplicates')       === 'true'
    const scanGit          = core.getInput('scan-git')         === 'true'
    const file             = core.getInput('file')
    const version          = core.getInput('version') || 'latest'
    const timeoutSecs      = parseInt(core.getInput('timeout') || '300', 10)
    const workingDirectory = core.getInput('working-directory')

    if (version === 'latest') {
      core.warning('devguard version is set to "latest" — pin a specific version (e.g. version: "3.3.0") for reproducible CI runs.')
    }

    const pkg = version === 'latest'
      ? '@kevinpatil/devguard'
      : `@kevinpatil/devguard@${version}`

    // Build args array — no shell injection possible since each value is a separate element
    const args = ['--yes', pkg]
    if (command)      args.push(command)
    if (strict)       args.push('--strict')
    if (json)         args.push('--json')
    if (score)        args.push('--score')
    if (sarif)        args.push('--sarif')
    if (licenses)     args.push('--licenses')
    if (supplyChain)  args.push('--supply-chain')
    if (duplicates)   args.push('--duplicates')
    if (scanGit)      args.push('--scan-git')
    if (file)         args.push('--file', file)

    core.info(`Running: npx ${args.join(' ')}`)

    const execOptions = {
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
      timeout: timeoutSecs * 1000,
      ...(workingDirectory ? { cwd: workingDirectory } : {}),
    }

    const output = execFileSync('npx', args, execOptions)
    process.stdout.write(output)

    const scoreVal = extractScore(output)
    if (scoreVal) core.setOutput('score', scoreVal)

    core.info('devguard audit passed.')
  } catch (err) {
    const stdout = err.stdout || ''
    const stderr = err.stderr || ''
    if (stdout) process.stdout.write(stdout)
    if (stderr) process.stderr.write(stderr)

    const scoreVal = extractScore(stdout)
    if (scoreVal) core.setOutput('score', scoreVal)

    if (err.signal === 'SIGTERM' || err.code === 'ETIMEDOUT') {
      core.setFailed(`devguard timed out after ${core.getInput('timeout') || '300'}s.`)
    } else {
      core.setFailed('devguard found issues. Fix errors before merging.')
    }
  }
}

run()
