import consola from 'consola'
import { PluginManager } from 'live-plugin-manager'
import { ProtoDefPlugin } from '../types.js'
import { Config, PluginDef } from './config.js'

type PluginCfg = {
  src: 'npm' | 'github' | 'local'
  version?: string
  repo?: string
  path?: string
  name: string
}

const manager = new PluginManager()

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

const pluginsFromConfig = (cfg: Config): PluginCfg[] => {
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
const installPlugins = async (plugins: PluginCfg[]) => {
  try {
    await Promise.all(plugins.map(plugin => install(plugin)))
  } catch (error) {
    const e = error as Error
    consola.error(`Plugin installation failed: ${e.message}`)
    throw e
  }
}

const requirePlugin = (plugin: PluginCfg): ProtoDefPlugin => {
  switch (plugin.src) {
    case 'npm': {
      return manager.require(plugin.name) as ProtoDefPlugin
    }
    case 'github': {
      return manager.require(plugin.repo ?? '') as ProtoDefPlugin
    }
    case 'local': {
      return manager.require(plugin.path ?? '') as ProtoDefPlugin
    }
  }
}

export const fetchPlugins = async (cfg: Config): Promise<ProtoDefPlugin[]> => {
  const plugins = pluginsFromConfig(cfg)
  await installPlugins(plugins)
  try {
    return plugins.map(plugin => requirePlugin(plugin))
  } catch (error) {
    const e = error as Error
    consola.error(`Plugin loading failed: ${e.message}`)
    throw e
  }
}
