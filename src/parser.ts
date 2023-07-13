// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { ProtoDef } from './parser/types.js'

// get the protocol doc comment
const parseDoc = (schema: object): string | undefined => {
  if ('doc' in schema) {
    return schema['doc'] as string
  }
}
// get the protocol name
const parseName = (schema: object): string => {
  if ('name' in schema) {
    return schema['name'] as string
  }
  throw new Error('every protocol must have a name')
}

export const parse = (def: object): ProtoDef => {
  const doc = parseDoc(def)
  console.log(def)
  const proto: ProtoDef = {
    doc,
    name: parseName(def),
    types: [],
    methods: []
  }
  return proto
}
