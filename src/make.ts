// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { consola } from 'consola'
import { is } from './is.js'
import {
  EnumDef,
  ErrorDef,
  FieldDef,
  FieldType,
  MethodDef,
  ParamDef,
  PrimitiveDef,
  RecordDef,
  RequestType,
  ReturnTypeDef,
  arrayDef,
  mapDef,
  primitiveDef,
  typeName,
  unionDef
} from './types.js'
import { RawType, fixDoc, getDoc, hasProp } from './util.js'

const parseRequestType = (doc: string): RequestType => {
  const match = new RegExp(/\|\s*(get|post|put|delete)\s*\|/i).exec(doc)

  if (match) {
    return match[1].trim() as RequestType
  }
  return 'GET'
}

// simple validation for objects that should have a name
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
  logicalPrim(type: Record<string, unknown>): PrimitiveDef {
    if (!is.logicalType(type)) {
      throw new Error(`invalid logical type => ${JSON.stringify(type)}`)
    }
    return primitiveDef(type['logicalType'] as string)
  },

  _handleString(type: string) {
    return is.primitive(type) ? primitiveDef(type) : typeName(type)
  },

  _handleObj(type: Record<string, unknown>) {
    if (hasProp(type, 'items')) {
      return arrayDef(make.fieldType(type['items'] as RawType))
    }
    if (hasProp(type, 'values')) {
      return mapDef(make.fieldType(type['values'] as RawType))
    }
    if (hasProp(type, 'logicalType')) {
      return make.logicalPrim(type)
    }
    throw new Error(`invalid type => ${JSON.stringify(type)}`)
  },
  fieldType(type: RawType): FieldType {
    if (type === undefined || type === null) {
      throw new Error('type is undefined')
    }
    if (typeof type === 'string' && !['map', 'array'].includes(type)) {
      return this._handleString(type)
    }

    if (Array.isArray(type)) {
      const typesList = type as RawType[]
      return unionDef(typesList.map(t => make.fieldType(t)))
    }

    if (typeof type === 'object') {
      return this._handleObj(type)
    }

    throw new Error(`invalid type => ${JSON.stringify(type)}`)
  },

  fieldDef(obj: Record<string, unknown>): FieldDef {
    validate(obj, `field name is undefined`)

    return {
      __brand: 'FieldDef',
      name: obj['name'] as string,
      type: make.fieldType(obj['type'] as RawType),
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
        make.fieldDef(f as Record<string, unknown>)
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
        make.fieldDef(f as Record<string, unknown>)
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
      type: make.fieldType(obj['type'] as RawType)
    }
  },

  returnType(obj: unknown): ReturnTypeDef {
    if (obj === undefined || obj === null) {
      throw new Error(`return type is undefined`)
    }
    if (typeof obj === 'string' && obj === 'null') {
      return { __brand: 'Void', type: 'void' }
    }
    return make.fieldType(obj as RawType)
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
      const msg = `invalid method definition ${JSON.stringify(def)}`
      consola.error(msg)
      throw new Error(msg)
    }
    const doc = getDoc(obj)
    return {
      __brand: 'MethodDef',
      doc: fixDoc(doc ?? '').trim(),
      name,
      httpRequestType: parseRequestType(doc ?? 'GET'),
      params: obj['request'].map(f => make.param(f as Record<string, unknown>)),
      returnType: make.returnType(obj['response'] as Record<string, unknown>)
    }
  }
}
