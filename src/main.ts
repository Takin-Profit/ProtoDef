/* eslint-disable tsdoc/syntax */
/* eslint-disable no-console */
// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { program } from '@commander-js/extra-typings'
import { getConfig } from './config.js'

const main = async () => {
  program
    .name('protodef')
    .version('0.0.1')
    .description(
      'Protodef CLI tool for generating code from Avro idl protocol definitions.'
    )
    .argument(
      '<schema-dir>',
      'path to a directory containing idl files to generate code from'
    )
    .option('-o, --out <out>', 'output directory', process.cwd())
    .option('-p, --plugin <plugin>', 'install plugin from npm')
    .option('--post <post>', 'post generation command')
    .option('-c, --config <config>', 'path to a config file (if not in cwd)')
    .option('-r, --repo <repo>', 'install plugin from git repo')
    .option('--path', 'install local plugin from path')
    .option('--version', 'install plugin version from npm')
    .allowExcessArguments(false)
    .allowUnknownOption(false)
    .action(async (dir, options) => {
      const cfg = await getConfig()
      console.log(cfg)
      console.log(dir)
      console.log('options =', options)
    })

  await program.parseAsync(process.argv)
}

await main()
/**
  const makePath = (file: string) =>
    path.join(
      path.dirname(url.fileURLToPath(import.meta.url).replace('/src', '')),
      'api',
      file
    )

*/
/**
  const getProtocol = (file: string) => {
    return readFileSync(makePath(file), 'utf8')
  }
*/

/**
  asvc.assembleProtocol(makePath('pt.avdl'), (err, schema) => {
    console.log(schema['types'][1]['fields'])
    console.log(JSON.stringify(build(schema)))
    console.error(err)
  })
*/
