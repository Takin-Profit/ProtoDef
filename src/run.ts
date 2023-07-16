import avsc from 'avsc'
import { consola } from 'consola'
import path from 'node:path'
import readdirp from 'readdirp'
import { build } from './build/index.js'
import { Config } from './config.js'
import { PathInfo } from './types.js'

export type RunConfig = {
  schemaDir: string
  plugins: Config
}
// builds the path info object to pass to the build function
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
