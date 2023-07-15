// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const _isTypeName = (x: unknown): x is TypeName =>
  typeof x === 'object' &&
  x !== null &&
  'name' in x &&
  '__brand' in x &&
  x.__brand === 'TypeName'

const _isPrimitiveDef = (x: unknown): x is PrimitiveDef =>
  typeof x === 'object' &&
  x !== null &&
  'type' in x &&
  '__brand' in x &&
  x.__brand === 'PrimitiveDef'

const _isMapDef = (x: unknown): x is MapDef =>
  typeof x === 'object' &&
  x !== null &&
  'values' in x &&
  '__brand' in x &&
  x.__brand === 'MapDef'

const _isArrayDef = (x: unknown): x is ArrayDef =>
  typeof x === 'object' &&
  x !== null &&
  'items' in x &&
  '__brand' in x &&
  x.__brand === 'ArrayDef'

const _isUnionDef = (x: unknown): x is UnionDef =>
  typeof x === 'object' &&
  x !== null &&
  'types' in x &&
  '__brand' in x &&
  x.__brand === 'UnionDef'

// these are the getters that are added to the type definitions
// to make it easier to determine the type when authoring plugins
type Getters = {
  isTypeName: boolean
  isPrimitiveDef: boolean
  isMapDef: boolean
  isArrayDef: boolean
  isUnionDef: boolean
}
/** represents the name of a type defined in the Protocol, Either a record or an Enum */
export type TypeName = { name: string } & { __brand: 'TypeName' } & Getters

export const typeName = (name: string): TypeName => {
  return {
    name,
    __brand: 'TypeName',
    get isTypeName() {
      return _isTypeName(this)
    },
    get isPrimitiveDef() {
      return _isPrimitiveDef(this)
    },
    get isMapDef() {
      return _isMapDef(this)
    },
    get isArrayDef() {
      return _isArrayDef(this)
    },
    get isUnionDef() {
      return _isUnionDef(this)
    }
  }
}
/** Avro primitive types */
export type PrimitiveDef =
  | ({ type: 'string'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'int'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'long'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'float'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'double'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'boolean'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'bytes'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'null'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'decimal'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'date'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'time-millis'; __brand: 'PrimitiveDef' } & Getters)
  | ({ type: 'timestamp_millis'; __brand: 'PrimitiveDef' } & Getters)

export const primitiveDef = (type: string): PrimitiveDef =>
  ({
    type,
    __brand: 'PrimitiveDef',
    get isTypeName() {
      return _isTypeName(this)
    },
    get isPrimitiveDef() {
      return _isPrimitiveDef(this)
    },
    get isMapDef() {
      return _isMapDef(this)
    },
    get isArrayDef() {
      return _isArrayDef(this)
    },
    get isUnionDef() {
      return _isUnionDef(this)
    }
  }) as PrimitiveDef
/** Avro Map Type */
export type MapDef = {
  values: FieldType
} & { __brand: 'MapDef' } & Getters

export const mapDef = (values: FieldType): MapDef => {
  return {
    values,
    __brand: 'MapDef',
    get isTypeName() {
      return _isTypeName(this)
    },
    get isPrimitiveDef() {
      return _isPrimitiveDef(this)
    },
    get isMapDef() {
      return _isMapDef(this)
    },
    get isArrayDef() {
      return _isArrayDef(this)
    },
    get isUnionDef() {
      return _isUnionDef(this)
    }
  }
}
/** Avro Array Type */
export type ArrayDef = {
  items: FieldType
} & { __brand: 'ArrayDef' } & Getters

export const arrayDef = (items: FieldType): ArrayDef => {
  return {
    items,
    __brand: 'ArrayDef',
    get isTypeName() {
      return _isTypeName(this)
    },
    get isPrimitiveDef() {
      return _isPrimitiveDef(this)
    },
    get isMapDef() {
      return _isMapDef(this)
    },
    get isArrayDef() {
      return _isArrayDef(this)
    },
    get isUnionDef() {
      return _isUnionDef(this)
    }
  }
}

/* represents an Avro Union type `union {etc, etc}` */
export type UnionDef = {
  types: (TypeName | PrimitiveDef | ArrayDef | MapDef | UnionDef)[]
} & {
  __brand: 'UnionDef'
} & Getters

export const unionDef = (types: FieldType[]): UnionDef => {
  return {
    types,
    __brand: 'UnionDef',
    get isTypeName() {
      return _isTypeName(this)
    },
    get isPrimitiveDef() {
      return _isPrimitiveDef(this)
    },
    get isMapDef() {
      return _isMapDef(this)
    },
    get isArrayDef() {
      return _isArrayDef(this)
    },
    get isUnionDef() {
      return _isUnionDef(this)
    }
  }
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

type Common = {
  name: string
  doc?: string
  fields: FieldDef[]
}
/** represents an Avro Record Definition */
export type RecordDef = Common & { __brand: 'RecordDef' }

/** represents an Avro Error Definition */
export type ErrorDef = Common & { __brand: 'ErrorDef' }

/** represents an Avro Message Param Definition */
export type ParamDef = {
  name: string
  type: FieldType
} & { __brand: 'ParamDef' }

/** Http Verbs that are accepted in doc comments to produce the proper
 * code output for clients and servers */
export type RequestType = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type Void = { type: 'void' } & { __brand: 'Void' }

/** represents an Avro Method Return Type Definition */
export type ReturnTypeDef = FieldType | Void
/** represents an Avro Method Definition */
export type MethodDef = {
  name: string
  doc?: string
  httpRequestType: RequestType
  returnType: ReturnTypeDef
  params: ParamDef[]
} & { __brand: 'MethodDef' }

/** Represents an Avro Protocol Definition */
export type ProtoDef = {
  doc?: string
  name: string
  records: RecordDef[]
  enums: EnumDef[]
  errors: ErrorDef[]
  methods: MethodDef[]
} & { __brand: 'ProtoDef' }
