/* eslint-disable unicorn/no-array-callback-reference */
// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { is } from './is.js'
import {
  ArrayDef,
  EnumDef,
  ErrorDef,
  FieldDef,
  FieldType,
  MapDef,
  MethodDef,
  ParamDef,
  PrimitiveDef,
  RecordDef,
  RequestType,
  ReturnTypeDef,
  TypeName,
  UnionDef
} from './types.js'
import { RawType, getDoc, getType, hasProp } from './util.js'

const parseRequestType = (doc: string): RequestType => {
  const match = new RegExp(/\|\s*(get|post|put|delete)\s*\|/i).exec(doc)

  if (match) {
    return match[1].trim() as RequestType
  }
  return 'GET'
}

const validate = (obj: Record<string, unknown>, errMsg: string) => {
  if (
    !('name' in obj) ||
    obj['name'] === undefined ||
    obj['name'] === null ||
    obj['name'] === ''
  ) {
    throw new Error(errMsg)
  }
}
export const make = {
  primitive(type: unknown): PrimitiveDef {
    return { type: type as string, __brand: 'PrimitiveDef' } as PrimitiveDef
  },
  union(typesList: unknown[]): UnionDef {
    return {
      types: typesList.map(t => this.fieldType(t as RawType)),
      __brand: 'UnionDef'
    }
  },
  typeName(name: unknown): TypeName {
    return { name: name as string, __brand: 'TypeName' }
  },

  map(type: unknown): MapDef {
    const t = getType(type) as Record<string, unknown>
    const values = t['values']
    const toBuild =
      typeof values === 'object' && values !== null && 'type' in values
        ? values
        : { type: values }
    return {
      values: this.fieldType(toBuild),
      __brand: 'MapDef'
    }
  },
  array(items: unknown): ArrayDef {
    const it = getType(items) as Record<string, unknown>
    const data = it['items']
    const toBuild =
      typeof data === 'object' && data !== null && 'type' in data
        ? data
        : { type: data }
    return { items: this.fieldType(toBuild), __brand: 'ArrayDef' }
  },

  logicalPrim(type: Record<string, unknown>): PrimitiveDef {
    return {
      type: type['logicalType'] as string,
      __brand: 'PrimitiveDef'
    } as PrimitiveDef
  },

  fieldType(type: RawType): FieldType {
    if (type === undefined || type === null) {
      throw new Error('type is undefined')
    }
    if (typeof type === 'string') {
      if (is.primitive(type)) {
        return make.primitive(type)
      }
      if (is.typeName(type)) {
        return make.typeName(type)
      }
    }
    if (typeof type === 'object') {
      if (hasProp(type, 'logicalType')) {
        return make.logicalPrim(type as Record<string, unknown>)
      }
      if (hasProp(type, 'values')) {
        return make.map(type)
      }
      if (hasProp(type, 'items')) {
        return make.array(type)
      }
    }

    if (Array.isArray(type)) {
      return make.union(type)
    }
    throw new Error(`invalid type => ${JSON.stringify(type)}`)
  },

  fieldDef(obj: Record<string, unknown>): FieldDef {
    validate(obj, `field name is undefined`)

    return {
      __brand: 'FieldDef',
      name: obj['name'] as string,
      type: this.fieldType(obj['type'] as RawType),
      doc: getDoc(obj)
    }
  },

  record(obj: Record<string, unknown>): RecordDef {
    validate(obj, `record name is undefined`)

    if (
      !('fields' in obj) ||
      obj['fields'] === undefined ||
      obj['fields'] === null ||
      !Array.isArray(obj['fields'])
    ) {
      throw new Error(`record fields are undefined`)
    }
    return {
      __brand: 'RecordDef',
      name: obj['name'] as string,
      fields: obj['fields'].map(f =>
        this.fieldDef(f as Record<string, unknown>)
      ),
      doc: getDoc(obj)
    }
  },

  error(obj: Record<string, unknown>): ErrorDef {
    validate(obj, `error name is undefined`)
    if (
      !('fields' in obj) ||
      obj['fields'] === undefined ||
      obj['fields'] === null ||
      !Array.isArray(obj['fields'])
    ) {
      throw new Error(`error fields are undefined`)
    }
    return {
      __brand: 'ErrorDef',
      name: obj['name'] as string,
      fields: obj['fields'].map(f =>
        this.fieldDef(f as Record<string, unknown>)
      ),
      doc: getDoc(obj)
    }
  },

  enum(obj: Record<string, unknown>): EnumDef {
    validate(obj, `enum name is undefined`)
    if (
      !('symbols' in obj) ||
      obj['symbols'] === undefined ||
      obj['symbols'] === null ||
      !Array.isArray(obj['symbols'])
    ) {
      throw new Error(`enum symbols are undefined`)
    }
    return {
      __brand: 'EnumDef',
      name: obj['name'] as string,
      symbols: obj['symbols'] as string[],
      doc: getDoc(obj)
    }
  },
  param(obj: Record<string, unknown>): ParamDef {
    validate(obj, `param name is undefined`)
    if (!('type' in obj) || obj['type'] === undefined || obj['type'] === null) {
      throw new Error(`param type is undefined`)
    }
    return {
      __brand: 'ParamDef',
      name: obj['name'] as string,
      type: this.fieldType(obj)
    }
  },

  returnType(obj: unknown): ReturnTypeDef {
    if (obj === undefined || obj === null) {
      throw new Error(`return type is undefined`)
    }
    if (typeof obj === 'string' && obj === 'null') {
      return { __brand: 'Void', type: 'void' }
    }
    return this.fieldType(obj as RawType)
  },

  method(def: { name: string; obj: Record<string, unknown> }): MethodDef {
    const { name, obj } = def
    if (
      !('request' in obj) ||
      !('response' in obj) ||
      obj['response'] === undefined ||
      obj['request'] === undefined ||
      obj['response'] === null ||
      obj['request'] === null ||
      !Array.isArray(obj['request'])
    ) {
      throw new Error(`invalid method definition`)
    }
    return {
      __brand: 'MethodDef',
      doc: getDoc(obj),
      name,
      httpRequestType: parseRequestType(getDoc(obj) ?? 'GET'),
      params: obj['request'].map(f => this.param(f as Record<string, unknown>)),
      returnType: this.returnType(obj['response'] as Record<string, unknown>)
    }
  }
}
