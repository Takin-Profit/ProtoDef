// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { getType, isObj } from './util.js'

export const is = {
  logicalType(type: unknown): boolean {
    return (
      isObj(type) &&
      'logicalType' in type &&
      [
        'decimal',
        'date',
        'time-ms',
        'timestamp-millis',
        'time-millis',
        'timestamp-ms'
      ].includes(type['logicalType'] as string)
    )
  },
  primitive(type: unknown): boolean {
    return (
      typeof type === 'string' &&
      [
        'string',
        'int',
        'long',
        'float',
        'double',
        'boolean',
        'bytes',
        'null',
        'decimal',
        'date'
      ].includes(type)
    )
  },
  container(type: unknown): boolean {
    return Array.isArray(type) || typeof type === 'object'
  },
  union(s: unknown): boolean {
    return Array.isArray(getType(s))
  },
  typeName(type: unknown): boolean {
    return (
      type !== undefined &&
      typeof type === 'string' &&
      ![
        'string',
        'int',
        'long',
        'float',
        'double',
        'boolean',
        'bytes',
        'null',
        'decimal',
        'date',
        'map',
        'array'
      ].includes(type)
    )
  },
  map(type: unknown): boolean {
    return (
      this.container(type) && !Array.isArray(type) && getType(type) === 'map'
    )
  },

  array(type: unknown): boolean {
    return (
      this.container(type) && !Array.isArray(type) && getType(type) === 'array'
    )
  }
}
