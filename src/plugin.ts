import { PluginManager } from 'live-plugin-manager'
import { Config, PluginDef } from './config.js'

const manager = new PluginManager()

export type PluginCfg = {
  src: 'npm' | 'github' | 'local'
  version?: string
  repo?: string
  path?: string
  name: string
}

const exists = (data: unknown): boolean => data !== undefined && data !== null

const src = (plugin: PluginDef): 'npm' | 'github' | 'local' => {
  if (!exists(plugin.repo) && !exists(plugin.path)) {
    return 'npm'
  }
  if (plugin.repo) {
    return 'github'
  }
  return plugin.path ? 'local' : 'npm'
}
const fromCfg = (cfg: Config): PluginCfg[] => {
  return cfg.map(plugin => {
    return {
      name: plugin.name,
      version: plugin.version,
      repo: plugin.repo,
      path: plugin.path,
      src: src(plugin)
    }
  })
}

const install = (plugin: PluginCfg) => {
  switch (plugin.src) {
    case 'npm': {
      return manager.install(plugin.name, plugin.version)
    }
    case 'github': {
      return manager.installFromGithub(plugin.repo ?? '')
    }
    case 'local': {
      return manager.installFromPath(plugin.path ?? '')
    }
  }
}
export const installPlugins = async (cfg: Config) => {
  try {
    await Promise.all(fromCfg(cfg).map(cf => install(cf)))
  } catch (error) {
    console.error(error)
  }
}
