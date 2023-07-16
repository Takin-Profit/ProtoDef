import avsc from 'avsc'
import { consola } from 'consola'
import path from 'node:path'
import readdirp from 'readdirp'
import { build } from '../build/build.js'
import { PathInfo } from '../types.js'
import { getConfig } from './config.js'
import { fetchPlugins } from './plugin.js'

// builds the path info object to pass to the build function
const pathInfo = (entry: readdirp.EntryInfo): PathInfo => {
  return {
    fileName: entry.path,
    fullPath: entry.fullPath,
    dirName: entry?.dirent?.path
  }
}

export const run = async (protosDir: string, configFile: string) => {
  try {
    const config = await getConfig(configFile)
    const plugins = await fetchPlugins(config)

    readdirp(path.join(process.cwd(), protosDir), {
      fileFilter: '*.avdl'
    }).on('data', (entry: readdirp.EntryInfo) => {
      const { fullPath } = entry
      const info = pathInfo(entry)

      avsc.assembleProtocol(fullPath, (err, schema) => {
        consola.box('schema =', schema)
        const data = build(schema, info)
        const toWrite = plugins.map(plugin => plugin(data))
        // TODO: replace this with actual file writing
        for (const file of toWrite) {
          consola.info(file.fileName)
          consola.info(file.contents)
        }
        consola.info(JSON.stringify(data, undefined, 2))
        consola.error(err)
      })
    })
  } catch (error) {
    consola.error(error)
  }
}
