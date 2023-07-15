import { make } from './make.js'
import { ProtoDef } from './types.js'
import {
  getDoc,
  getEnums,
  getErrors,
  getMethods,
  getProtoName,
  getRecords
} from './util.js'

export const build = (data: unknown): ProtoDef => {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('Invalid Input data must be an object')
  }

  return {
    name: getProtoName(data as Record<string, unknown>),
    doc: getDoc(data as Record<string, unknown>),
    records: getRecords(data as Record<string, unknown>).map(r =>
      make.record(r)
    ),
    enums: getEnums(data as Record<string, unknown>).map(e => make.enum(e)),
    errors: getErrors(data as Record<string, unknown>).map(e => make.error(e)),
    methods: getMethods(data as Record<string, unknown>).map(m =>
      make.method(m)
    ),
    __brand: 'ProtoDef'
  }
}
