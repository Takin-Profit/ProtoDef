// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import { pathExists } from 'fs-extra'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import toml from 'toml'
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

export const hasConfigFile = () => {
  try {
    return pathExists(path.join(process.cwd(), '.protodef.toml'))
  } catch {
    return new Promise(() => false)
  }
}

const parseConfig = (config: Record<string, unknown>): Config => {
  try {
    const plugins = Object.entries(config['protodef'] as object).map(
      ([key, value]) => {
        const plugin = value as Record<string, unknown>
        return {
          name: key,
          out: plugin['out'] as string,
          post: plugin['post'] as string,
          version: plugin['version'] as string,
          repo: plugin['repo'] as string,
          path: plugin['path'] as string
        }
      }
    )
    return plugins as Config
  } catch (error) {
    console.error(error)
    throw error
  }
}
export const getConfig = async (): Promise<Config> => {
  try {
    const config = await readFile(
      path.join(process.cwd(), '.protodef.toml'),
      'utf8'
    )
    const cfg = toml.parse(config) as unknown
    return parseConfig(cfg as Record<string, unknown>)
  } catch (error) {
    console.error(error)
    throw error
  }
}
