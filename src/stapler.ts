import * as exec from '@actions/exec'

import {ExecOptions} from '@actions/exec/lib/interfaces'

export async function stapleApp(
  appPath: string,
  options?: ExecOptions
): Promise<void> {
  const args: string[] = ['stapler', 'staple', appPath]

  await exec.exec('xcrun', args, options)
}
