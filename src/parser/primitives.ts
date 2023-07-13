// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
/** represents the name of a type defined in the idl */
export type TypeName = { name: string } & { __brand: 'TypeName' }

export type AvroPrimString =
  | 'string'
  | 'int'
  | 'long'
  | 'float'
  | 'double'
  | 'boolean'
  | 'bytes'
  | 'null'
  | 'decimal'
  | 'date'
  | 'time-ms'
  | 'timestamp-millis'
type Prim<T extends AvroPrimString> = { name: T } & { __brand: 'AvroPrimitive' }

/** Avro primitive types */
export type AvroPrimitive =
  | Prim<'string'>
  | Prim<'int'>
  | Prim<'long'>
  | Prim<'float'>
  | Prim<'double'>
  | Prim<'boolean'>
  | Prim<'bytes'>
  | Prim<'null'>
  | Prim<'decimal'>
  | Prim<'date'>
  | Prim<'time-ms'>
  | Prim<'timestamp-millis'>

export const prim = (name: AvroPrimString): AvroPrimitive =>
  ({ name, __brand: 'AvroPrimitive' }) as AvroPrimitive
