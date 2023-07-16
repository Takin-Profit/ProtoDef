// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { PathInfo, ProtoDef } from '../types.js'
import { make } from './make.js'
import {
  getDoc,
  getEnums,
  getErrors,
  getMethods,
  getNamespace,
  getProtoName,
  getRecords
} from './util.js'

export const build = (data: unknown, pathInfo: PathInfo): ProtoDef => {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('Invalid Input data must be an object')
  }
  const methods = getMethods(data as Record<string, unknown>)
  const errors = getErrors(data as Record<string, unknown>)
  const enums = getEnums(data as Record<string, unknown>)
  const records = getRecords(data as Record<string, unknown>)
  return {
    pathInfo,
    namespace: getNamespace(data as Record<string, unknown>),
    name: getProtoName(data as Record<string, unknown>),
    doc: getDoc(data as Record<string, unknown>),
    records: records ? records.map(r => make.record(r)) : undefined,
    enums: enums ? enums.map(e => make.enum(e)) : undefined,
    errors: errors ? errors.map(e => make.error(e)) : undefined,
    methods: methods ? methods.map(m => make.method(m)) : undefined,
    __brand: 'ProtoDef'
  }
}
