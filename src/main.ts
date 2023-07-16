// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { program } from '@commander-js/extra-typings'
import { consola } from 'consola'
import { getConfig } from './config.js'
import { run } from './run.js'

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
      consola.info(cfg)
      consola.info(dir)
      consola.info('options =', options)
      run(dir)
    })

  await program.parseAsync(process.argv)
}

await main()
