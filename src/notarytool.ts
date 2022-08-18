import * as exec from '@actions/exec'
import * as fs from 'fs'
import * as io from '@actions/io'
import * as path from 'path'

import {ExecOptions} from '@actions/exec/lib/interfaces'

/**
 Upload the specified application.
 @param appPath The path to the app to notarize.
 @param apiKeyId The id of the API key to use (private key must already be installed)
 @param issuerId The issuer identifier of the API key.
 @param options (Optional) Command execution options.
 */
export async function notarizeApp(
  appPath: string,
  apiKeyId: string,
  issuerId: string,
  options?: ExecOptions
): Promise<void> {
  const args: string[] = [
    'notarytool',
    'submit',
    //    '--output-format',
    //    'json',
    appPath,
    '--key-path',
    path.join(privateKeysPath(), `AuthKey_${apiKeyId}.p8`),
    '--key-id',
    apiKeyId,
    '--issuer-id',
    issuerId,
    '--wait'
  ]

  await exec.exec('xcrun', args, options)
}

function privateKeysPath(): string {
  const home: string = process.env['HOME'] || ''
  if (home === '') {
    throw new Error('Unable to determine user HOME path')
  }
  return path.join(home, 'private_keys')
}

export async function installPrivateKey(
  apiKeyId: string,
  apiPrivateKey: string
): Promise<void> {
  await io.mkdirP(privateKeysPath())
  fs.writeFileSync(
    path.join(privateKeysPath(), `AuthKey_${apiKeyId}.p8`),
    apiPrivateKey
  )
}

export async function deleteAllPrivateKeys(): Promise<void> {
  await io.rmRF(privateKeysPath())
}

// Currently unused, we can just send a dmg. Will be needed if we want to support different formats
export async function archive(appPath: string): Promise<string> {
  const archivePath = '/tmp/archive.zip' // TODO Temporary file

  const args = [
    '-c', // Create an archive at the destination path
    '-k', // Create a PKZip archive
    '--keepParent', // Embed the parent directory name src in dst_archive.
    appPath, // Source
    archivePath // Destination
  ]

  await exec.exec('ditto', args)

  return archivePath
}
