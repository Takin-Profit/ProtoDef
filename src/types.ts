// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export type TypeDef = EnumDef | UnionDef | RecordDef | ErrorDef

export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE'
export type FieldDef = {
  name: string
  type: string | string[]
  doc?: string
}

type TypeDefCommon = {
  name: string
  doc?: string
  fields: FieldDef[]
}

/** represents an Avro error definition  see https://avro.apache.org/docs/1.11.1/idl-language/#defining-records-and-errors*/
export type ErrorDef = TypeDefCommon & { __brand: 'ErrorDef' }
export type EnumDef = { name: string; symbols: string[]; doc?: string } & {
  __brand: 'EnumDef'
}
export type MethodDef = TypeDefCommon & { __brand: 'MethodDef' }
export type UnionDef = { types: string[] } & { __brand: 'UnionDef' }
export type RecordDef = TypeDefCommon & { __brand: 'RecordDef' }

export type ProtoDef = {
  doc?: string
  name: string
  types: TypeDef[]
  methods: MethodDef[]
}
