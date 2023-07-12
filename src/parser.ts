// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { ProtoDef } from './types.js'

const parseDoc = (schema: object): string | undefined => {
  if ('doc' in schema) {
    return schema['doc'] as string
  }
}
export const parse = (def: object): ProtoDef => {
  const doc = parseDoc(def)
  console.log(def)
  const proto: ProtoDef = {
    doc,
    name: '',
    types: [],
    methods: []
  }
  return proto
}
