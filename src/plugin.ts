/** Getters that are common to all Types that are a `FieldType` */
export type Getters = {
  isTypeName: boolean
  isPrimitiveDef: boolean
  isMapDef: boolean
  isArrayDef: boolean
  isUnionDef: boolean
}
export type TypeName = { name: string } & Getters

/** Avro primitive types */
export type PrimitiveDef =
  | ({ type: 'string' } & Getters)
  | ({ type: 'int' } & Getters)
  | ({ type: 'long' } & Getters)
  | ({ type: 'float' } & Getters)
  | ({ type: 'double' } & Getters)
  | ({ type: 'boolean' } & Getters)
  | ({ type: 'bytes' } & Getters)
  | ({ type: 'null' } & Getters)
  | ({ type: 'decimal' } & Getters)
  | ({ type: 'date' } & Getters)
  | ({ type: 'time-millis' } & Getters)
  | ({ type: 'timestamp_millis' } & Getters)

/** Avro Map Type */
export type MapDef = {
  values: FieldType
} & Getters

/** Avro Array Type */
export type ArrayDef = {
  items: FieldType
} & Getters

/* represents an Avro Union type `union {etc, etc}` */
export type UnionDef = {
  types: (TypeName | PrimitiveDef | ArrayDef | MapDef | UnionDef)[]
} & Getters

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
export type RecordDef = {
  name: string
  doc?: string
  fields: FieldDef[]
}

/** represents an Avro Error Definition */
export type ErrorDef = {
  name: string
  doc?: string
  fields: FieldDef[]
}

/** represents an Avro Message Param Definition */
export type ParamDef = {
  name: string
  type: FieldType
}

/** Http Verbs that are accepted in doc comments to produce the proper
 * code output for clients and servers */
export type RequestType = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type Void = { type: 'void' }

/** represents an Avro Method Return Type Definition */
export type ReturnTypeDef = FieldType | Void
/** represents an Avro Method Definition */
export type MethodDef = {
  name: string
  doc?: string
  httpRequestType: RequestType
  returnType: ReturnTypeDef
  params: ParamDef[]
}

/** Represents an Avro Protocol Definition */
export type ProtoDef = {
  doc?: string
  name: string
  records: RecordDef[]
  enums: EnumDef[]
  errors: ErrorDef[]
  methods: MethodDef[]
}

/** Represents a generated code file returned from a ProtoDef plugin */
export type GeneratedCode = { fileName: string; contents: string }

/** Represents a ProtoDef plugin */
export type ProtoDefPlugin = (protos: ProtoDef[]) => GeneratedCode[]
