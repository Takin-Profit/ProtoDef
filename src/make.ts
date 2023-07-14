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
import { getDoc } from './util.js'

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
    return { types: typesList.map(t => this.fieldType(t)), __brand: 'UnionDef' }
  },
  typeName(name: unknown): TypeName {
    return { name: name as string, __brand: 'TypeName' }
  },

  map(values: unknown): MapDef {
    return { values: this.fieldType(values), __brand: 'MapDef' }
  },
  array(items: unknown): ArrayDef {
    return { items: this.fieldType(items), __brand: 'ArrayDef' }
  },
  fieldType(type: unknown): FieldType {
    if (type === undefined || type === null) {
      throw new Error('type is undefined')
    }
    switch (type) {
      case is.primitive(type): {
        return make.primitive(type)
      }
      case is.union(type): {
        return make.union(type as unknown[])
      }
      case is.typeName(type): {
        return make.typeName(type as unknown)
      }
      case is.map(type): {
        return make.map(type)
      }
      case is.array(type): {
        return make.array(type)
      }
      default: {
        return make.primitive(type)
      }
    }
  },
  fieldDef(obj: Record<string, unknown>): FieldDef {
    validate(obj, `field name is undefined`)

    return {
      __brand: 'FieldDef',
      name: obj['name'] as string,
      type: this.fieldType(obj),
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
    return this.fieldType(obj)
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
