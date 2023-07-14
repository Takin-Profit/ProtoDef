// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/** Http Verbs that are accepted in doc comments to produce the proper
 * code output for clients and servers */
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE'

/** represents the name of a type defined in the Protocol, Either a record or an Enum */
export type TypeName = { name: string } & { __brand: 'TypeName' }

/** Avro primitive types */
export type PrimitiveDef =
  | { type: 'string'; __brand: 'PrimitiveDef' }
  | { type: 'int'; __brand: 'PrimitiveDef' }
  | { type: 'long'; __brand: 'PrimitiveDef' }
  | { type: 'float'; __brand: 'PrimitiveDef' }
  | { type: 'double'; __brand: 'PrimitiveDef' }
  | { type: 'boolean'; __brand: 'PrimitiveDef' }
  | { type: 'bytes'; __brand: 'PrimitiveDef' }
  | { type: 'null'; __brand: 'PrimitiveDef' }
  | { type: 'decimal'; __brand: 'PrimitiveDef' }
  | { type: 'date'; __brand: 'PrimitiveDef' }
  | { type: 'time-ms'; __brand: 'PrimitiveDef' }
  | { type: 'timestamp-millis'; __brand: 'PrimitiveDef' }

/** Avro Map Type */
export type MapDef = {
  values: FieldType
} & { __brand: 'MapDef' }

/** Avro Array Type */
export type ArrayDef = {
  items: FieldType
} & { __brand: 'ArrayDef' }

/* represents an Avro Union type `union {etc, etc}` */
export type UnionDef = {
  types: (TypeName | PrimitiveDef | ArrayDef | MapDef | UnionDef)[]
} & {
  __brand: 'UnionDef'
}

export type EnumDef = { name: string; symbols: string[]; doc?: string } & {
  __brand: 'EnumDef'
}

/** represents an Avro Record field possible type */
export type FieldType = TypeName | MapDef | UnionDef | ArrayDef | PrimitiveDef

/** represents a field in an Avro Record definition */
export type FieldDef = {
  name: string
  type: FieldType
  doc?: string
} & { __brand: 'FieldDef' }

/** represents an Avro Record Definition */
type RecordDef = {
  name: string
  doc?: string
  fields: FieldDef[]
} & { __brand: 'RecordDef' }

/** represents an Avro Error Definition */
export type ErrorDef = RecordDef & { __brand: 'ErrorDef' }
/** represents an Avro Method Definition */
export type MethodDef = RecordDef & { __brand: 'MethodDef' }

/** Represents an Avro Protocol Definition */
export type ProtoDef = {
  doc?: string
  name: string
  records: RecordDef[]
  enums: EnumDef[]
  errors: ErrorDef[]
  methods: MethodDef[]
}
