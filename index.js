const { execSync } = require('child_process')
const core = require('@actions/core')

async function run() {
  try {
    const command = core.getInput('command')
    const strict = core.getInput('strict') === 'true'
    const json = core.getInput('json') === 'true'
    const file = core.getInput('file')
    const version = core.getInput('version') || 'latest'

    const pkg = version === 'latest'
      ? '@kevinpatil/devguard'
      : `@kevinpatil/devguard@${version}`

    let args = command ? command : ''
    if (strict) args += ' --strict'
    if (json) args += ' --json'
    if (file) args += ` --file ${file}`

    const cmd = `npx --yes ${pkg} ${args}`.trim()

    core.info(`Running: ${cmd}`)

    execSync(cmd, { stdio: 'inherit' })

    core.info('devguard audit passed.')
  } catch (err) {
    core.setFailed('devguard found issues. Fix errors before merging.')
  }
}

run()
