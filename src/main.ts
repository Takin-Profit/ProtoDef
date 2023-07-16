// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { command, option, optional, positional, run, string } from 'cmd-ts'
import { getConfig } from './config.js'

const app = command({
  name: 'protodef',
  version: '0.1.0',
  args: {
    protos: positional({
      type: string,
      displayName: 'protos',
      description: 'Path to directory containing .avdl proto files'
    }),
    config: option({
      type: optional(string),
      long: 'config',
      short: 'c',
      env: 'PROTODEF_CONFIG',
      description: 'Path to config file if it is not in the default location',
      defaultValue: () => `${process.cwd()}.protodef.toml`
    })
  },
  handler: async ({ protos, config }) => {
    // cmd-ts should handle the default value for config, but it doesn't
    const conf = await getConfig(config ?? `${process.cwd()}.protodef.toml`)
  }
})

const main = async () => {
  await run(app, process.argv.slice(2))
}

await main()
