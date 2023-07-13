// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.





/* represents an Avro Union type `union {etc, etc}` */


const isPrimitive = (s: unknown): s is AvroPrimString => {
  return typeof s === 'string' &&
  ['string', 'int', 'long', 'float', 'double', 'boolean', 'bytes', 'null', 'decimal', 'date', 'time-ms', 'timestamp-millis'].includes(s)
}

const buildType = (type: unknown): FieldType => {
  if (type === undefined || type === null) {
    throw new Error('type is undefined')
  }
  if (isPrimitive(type)) {
    return prim(type)
  }
  if (Array.isArray(type)) {
    return avroUnion(type as unknown[])
  }
  if (typeof type === 'object' && 'type' in type && type['type'] === 'map') {

  }
}
const avroUnion = (types: unknown[]): AvroUnion => {
  return {} as AvroUnion
}





export const isAvroMap = (s: unknown): s is AvroMap => {
  return (
    s !== undefined &&
    typeof s === 'object' &&
    (s as AvroMap).__brand === 'AvroMap'
  )
}



export const isAvroArray = (s: unknown): s is AvroArray => {
  return (
    s !== undefined &&
    typeof s === 'object' &&
    (s as AvroArray).__brand === 'AvroArray'
  )
}

/** Http Verbs that are accepted in doc comments to produce the proper
 * code output for clients and servers */
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** represents an Avro Record field definition */
export type FieldDef = {
  name: string
  type: FieldType
  doc?: string
} & { __brand: 'FieldDef' }

/** checks if the type is a FieldDef */
export const isFieldDef = (s: unknown): s is FieldDef => {
  return (
    s !== undefined &&
    typeof s === 'object' &&
    (s as FieldDef).__brand === 'FieldDef'
  )
}

export const fieldDef = (obj: Record<string, unknown>): FieldDef => {
  const fd = (type: FieldType) => ({__brand: 'FieldDef', name: obj['name'] as string, type, doc: obj['doc'] as string})

  if (obj['type'] === undefined) {
    throw new Error(`field name ${obj["name"]} type is undefined`)
  }
  // if field type is an array, it is a union
  if (Array.isArray(obj['type'])) {
    return fd(avroUnion(obj['type']))
  }
  if ()

  return {__brand: 'FieldDef'} as   FieldDef
}

type TypeDef = {
  name: string
  doc?: string
  fields: FieldDef[]
}

/** represents an Avro error definition  see https://avro.apache.org/docs/1.11.1/idl-language/#defining-records-and-errors*/
export type ErrorDef = TypeDef & { __brand: 'ErrorDef' }
export type EnumDef = { name: string; symbols: string[]; doc?: string } & {
  __brand: 'EnumDef'
}
export type MethodDef = TypeDef & { __brand: 'MethodDef' }
export type UnionDef = { types: string[] } & { __brand: 'UnionDef' }
export type RecordDef = TypeDef & { __brand: 'RecordDef' }

export type ProtoDef = {
  doc?: string
  name: string
  records: RecordDef[]
  enums: EnumDef[]
  errors: ErrorDef[]
  methods: MethodDef[]
}
