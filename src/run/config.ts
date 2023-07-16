// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import consola from 'consola'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import toml from 'toml'
import { hasProp } from '../build/util.js'

/** The schema for a plugin loaded from either a toml config or cli options */
export type PluginDef = {
  /** Commands to run after code generation (formatters, etc). */
  post?: string
  /** Path to write output files. */
  out: string
  /** Install the plugin package with this name from npm.
   * Will be parsed from the toml object header key.
   */
  name: string
  /** Install the specified plugin package version from npm. */
  version?: string
  /** Install the specified plugin package from github. repository is specified in the format owner/repository_name#ref (like expressjs/express#351396f). Dependencies are automatically installed (devDependencies are ignored).  */
  repo?: string
  /** Install the specified plugin package from a filesystem location. Dependencies are automatically installed from npm. node_modules folder is excluded from source location. */
  path?: string
}

export type Config = PluginDef[]

/** Check if a file exists at the given path */
const hasConfigFile = async (path: string) => {
  if (!path.endsWith('.protodef.toml')) {
    throw new Error(
      `${path} is an invalid config file. Must be a toml file named .protodef.toml`
    )
  }
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

const getProp = (
  prop: string,
  obj: Record<string, unknown>
): string | undefined => {
  if (hasProp(obj, prop)) {
    return obj[prop] as string
  }
}

const validate = (plugin: Record<string, unknown>) => {
  if (!hasProp(plugin, 'out')) {
    throw new Error(
      'invalid plugin. Missing "out" key. This key is required in order to write the generated code to a file.'
    )
  }
}

const parseConfig = (config: Record<string, unknown>): Config => {
  if ('protodef' in config === false) {
    throw new Error('invalid config. Missing "protodef" key')
  }

  try {
    const plugins = Object.entries(config['protodef'] as object).map(
      ([key, value]) => {
        const plugin = value as Record<string, unknown>
        validate(plugin)
        return {
          name: `protodef_${key}`,
          out: plugin['out'] as string,
          post: getProp('post', plugin),
          version: getProp('version', plugin),
          repo: getProp('repo', plugin),
          path: getProp('path', plugin)
        }
      }
    )
    return plugins as Config
  } catch (error) {
    consola.error(error)
    throw error
  }
}
/** Get the config from a toml file */
export const getConfig = async (config: string): Promise<Config> => {
  const hasCfg = await hasConfigFile(config)
  if (!hasCfg) {
    consola.error(`Config file not found at ${config}`)
    throw new Error(`Config file not found at ${config}`)
  }
  try {
    const conf = await readFile(
      path.join(process.cwd(), '.protodef.toml'),
      'utf8'
    )
    const cfg = toml.parse(conf) as unknown
    return parseConfig(cfg as Record<string, unknown>)
  } catch (error) {
    consola.error(error)
    throw error
  }
}
