// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import {
  ArrayDef,
  FieldDef,
  FieldType,
  MapDef,
  PrimitiveDef,
  TypeName,
  UnionDef
} from './types.js'
import { is } from './is.ts'

const getDoc = (obj: Record<string, unknown>): string | undefined => {
  if (obj['doc'] === undefined || obj['doc'] === null) {
    return undefined
  }
  return obj['doc'] as string
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
    if (
      obj['name'] === undefined ||
      obj['name'] === null ||
      obj['name'] === ''
    ) {
      throw new Error(`field name is undefined`)
    }
    return {
      __brand: 'FieldDef',
      name: obj['name'] as string,
      type: this.fieldType(obj),
      doc: getDoc(obj)
    }
  }
}
