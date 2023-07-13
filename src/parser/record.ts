// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { AvroType } from './types.js'

const parseFieldType = (data: Record<string, unknown>): AvroType => {
  const type = data['type']
  if (Array.isArray(type)) {
    console.log('isArray')
  }
  return 'int'
}
const parseField = (data: Record<string, unknown>) => {
  console.log(data)
}

const makeRecord = (data: Record<string, unknown>) => {
  const name = data['name'] as string
  console.log(name)
}
export const parseRecords = (schema: Record<string, unknown>) => {
  if (schema) {
    const types = schema['types'] as Record<string, unknown>[]
    const records = types.filter(t => t['type'] === 'record')
    for (const r of records) {
      makeRecord(r)
      const fields = r['fields'] as Record<string, unknown>[]
      for (const f of fields) {
        parseField(f)
      }
    }
  }
  return []
}
