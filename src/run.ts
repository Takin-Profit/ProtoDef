import avsc from 'avsc'
import { consola } from 'consola'
import path from 'node:path'
import readdirp from 'readdirp'
import { Config } from './config.js'
import { make } from './make.js'
import { PathInfo, ProtoDef } from './types.js'
import {
  getDoc,
  getEnums,
  getErrors,
  getMethods,
  getNamespace,
  getProtoName,
  getRecords
} from './util.js'

export type RunConfig = {
  schemaDir: string
  plugins: Config
}

const pathInfo = (entry: readdirp.EntryInfo): PathInfo => {
  return {
    fileName: entry.path,
    fullPath: entry.fullPath,
    dirName: entry?.dirent?.path
  }
}
export const run = (dir: string) => {
  try {
    readdirp(path.join(process.cwd(), dir), { fileFilter: '*.avdl' }).on(
      'data',
      (entry: readdirp.EntryInfo) => {
        const { fullPath } = entry
        const info = pathInfo(entry)

        avsc.assembleProtocol(fullPath, (err, schema) => {
          consola.box('schema =', schema)
          const data = build(schema, info)
          consola.info(JSON.stringify(data, undefined, 2))
          consola.error(err)
        })
      }
    )
  } catch (error) {
    consola.error(error)
  }
}

export const build = (data: unknown, pathInfo: PathInfo): ProtoDef => {
  if (typeof data !== 'object' || data === null) {
    throw new TypeError('Invalid Input data must be an object')
  }
  const methods = getMethods(data as Record<string, unknown>)
  const errors = getErrors(data as Record<string, unknown>)
  const enums = getEnums(data as Record<string, unknown>)
  const records = getRecords(data as Record<string, unknown>)
  return {
    pathInfo,
    namespace: getNamespace(data as Record<string, unknown>),
    name: getProtoName(data as Record<string, unknown>),
    doc: getDoc(data as Record<string, unknown>),
    records: records ? records.map(r => make.record(r)) : undefined,
    enums: enums ? enums.map(e => make.enum(e)) : undefined,
    errors: errors ? errors.map(e => make.error(e)) : undefined,
    methods: methods ? methods.map(m => make.method(m)) : undefined,
    __brand: 'ProtoDef'
  }
}
