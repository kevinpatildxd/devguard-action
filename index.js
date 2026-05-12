const { execSync } = require('child_process')
const core = require('@actions/core')

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, '')
}

async function run() {
  try {
    const command     = core.getInput('command')
    const strict      = core.getInput('strict')       === 'true'
    const json        = core.getInput('json')         === 'true'
    const score       = core.getInput('score')        === 'true'
    const sarif       = core.getInput('sarif')        === 'true'
    const licenses    = core.getInput('licenses')     === 'true'
    const supplyChain = core.getInput('supply-chain') === 'true'
    const duplicates  = core.getInput('duplicates')   === 'true'
    const scanGit     = core.getInput('scan-git')     === 'true'
    const file        = core.getInput('file')
    const version     = core.getInput('version') || 'latest'

    const pkg = version === 'latest'
      ? '@kevinpatil/devguard'
      : `@kevinpatil/devguard@${version}`

    let args = command ? command : ''
    if (strict)      args += ' --strict'
    if (json)        args += ' --json'
    if (score)       args += ' --score'
    if (sarif)       args += ' --sarif'
    if (licenses)    args += ' --licenses'
    if (supplyChain) args += ' --supply-chain'
    if (duplicates)  args += ' --duplicates'
    if (scanGit)     args += ' --scan-git'
    if (file)        args += ` --file ${file}`

    const cmd = `npx --yes ${pkg} ${args}`.trim()

    core.info(`Running: ${cmd}`)

    const output = execSync(cmd, { encoding: 'utf8', stdio: ['inherit', 'pipe', 'inherit'] })
    process.stdout.write(output)

    const match = stripAnsi(output).match(/(\d+)\s*\/\s*100/)
    if (match) core.setOutput('score', match[1])

    core.info('devguard audit passed.')
  } catch (err) {
    const output = err.stdout || ''
    if (output) process.stdout.write(output)

    const match = stripAnsi(output).match(/(\d+)\s*\/\s*100/)
    if (match) core.setOutput('score', match[1])

    core.setFailed('devguard found issues. Fix errors before merging.')
  }
}

run()
