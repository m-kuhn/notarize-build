import * as core from '@actions/core'
import * as os from 'os'
import * as notarytool from './notarytool'

import {ExecOptions} from '@actions/exec/lib/interfaces'

async function run(): Promise<void> {
  try {
    if (os.platform() !== 'darwin') {
      throw new Error('Action requires macOS agent.')
    }

    const issuerId: string = core.getInput('issuer-id')
    const apiKeyId: string = core.getInput('api-key-id')
    const apiPrivateKey: string = core.getInput('api-private-key')
    const appPath: string = core.getInput('app-path')

    let output = ''
    const options: ExecOptions = {}
    options.listeners = {
      stdout: (data: Buffer) => {
        output += data.toString()
      }
    }

    await notarytool.installPrivateKey(apiKeyId, apiPrivateKey)
    await notarytool.notarizeApp(appPath, apiKeyId, issuerId, options)
    await notarytool.deleteAllPrivateKeys()

    core.setOutput('notarytool-response', output)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
