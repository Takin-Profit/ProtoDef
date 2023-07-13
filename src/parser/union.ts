// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { AvroPrimitive, TypeName } from './primitives.js'

/** Checks if the type is an AvroUnion */
export const isAvroUnion = (s: unknown): s is AvroUnion => {
  return (
    s !== undefined &&
    typeof s === 'object' &&
    (s as AvroUnion).__brand === 'AvroUnion'
  )
}

export type AvroUnion = {
  types: (TypeName | AvroPrimitive | AvroArray | AvroMap)[]
} & {
  __brand: 'AvroUnion'
}
