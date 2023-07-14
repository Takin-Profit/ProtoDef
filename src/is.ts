// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Cast unknown to a type that can be worked with
type Field = Record<string, unknown> & { type: unknown }

// convert from unknown to Field
const getField = (s: unknown): Field => {
  if (typeof s !== 'object' || s === null || !('type' in s)) {
    throw new Error('invalid field')
  }
  return s as Field
}

const getType = (s: unknown): unknown => {
  return getField(s)['type']
}

export const is = {
  primitive(s: unknown): boolean {
    const type = getType(s)
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
        'date',
        'time-ms',
        'timestamp-millis'
      ].includes(type)
    )
  },
  container(s: unknown): boolean {
    const type = getType(s)
    return Array.isArray(type) || typeof type === 'object'
  },
  union(s: unknown): boolean {
    return Array.isArray(getType(s))
  },
  typeName(s: unknown): boolean {
    const type = getType(s)
    return (
      type !== undefined && typeof type === 'string' && !this.primitive(type)
    )
  },
  map(s: unknown): boolean {
    const type = getType(s)
    return (
      this.container(type) && !Array.isArray(type) && getType(type) === 'map'
    )
  },

  array(s: unknown): boolean {
    const type = getType(s)
    return (
      this.container(type) && !Array.isArray(type) && getType(type) === 'array'
    )
  }
}
