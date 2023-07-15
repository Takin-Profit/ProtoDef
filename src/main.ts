/* eslint-disable tsdoc/syntax */
/* eslint-disable no-console */
// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import asvc from 'avsc'
import path from 'node:path'
import url from 'node:url'
import { build } from './build.js'

const makePath = (file: string) =>
  path.join(
    path.dirname(url.fileURLToPath(import.meta.url).replace('/src', '')),
    'api',
    file
  )

/**
  const getProtocol = (file: string) => {
    return readFileSync(makePath(file), 'utf8')
  }
*/

asvc.assembleProtocol(makePath('pt.avdl'), (err, schema) => {
  // console.log(schema['types'][2]['fields'])
  console.log(build(schema))
  console.error(err)
})
