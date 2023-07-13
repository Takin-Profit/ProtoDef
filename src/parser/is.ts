// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { AvroPrimString } from './primitives.js'

export const is = {
  primitive(s: unknown): s is AvroPrimString {
    return (
      typeof s === 'string' &&
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
        'date',
        'time-ms',
        'timestamp-millis'
      ].includes(s)
    )
  },
  union(s: unknown): boolean {
    return Array.isArray(s)
  },
  typeName(s: unknown): boolean {
    return s !== undefined && typeof s === 'string' && !this.primitive(s)
  },
  map(s: unknown): boolean {
    return (
      s !== undefined &&
      typeof s === 'object' &&
      !Array.isArray(s) &&
      s !== null &&
      'type' in s
    )
  }
}
