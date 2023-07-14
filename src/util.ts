// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export type Lang = 'ts' | 'py'
// grab the protocol doc comment
export const getDoc = (obj: Record<string, unknown>): string | undefined => {
  if (obj['doc'] === undefined || obj['doc'] === null) {
    return undefined
  }
  return obj['doc'] as string
}

const protocol = 'protocol'
// grab the protocol name
export const getProtoName = (schema: Record<string, unknown>): string =>
  schema[protocol] as string

export const getTypes = (
  schema: Record<string, unknown>
): Record<string, unknown>[] =>
  'types' in schema ? (schema['types'] as Record<string, unknown>[]) : []

export const getRecords = (
  schema: Record<string, unknown>
): Record<string, unknown>[] =>
  getTypes(schema).filter(t => 'type' in t && t['type'] === 'record')

export const getEnums = (
  schema: Record<string, unknown>
): Record<string, unknown>[] =>
  getTypes(schema).filter(t => 'type' in t && t['type'] === 'enum')

export const getErrors = (
  schema: Record<string, unknown>
): Record<string, unknown>[] =>
  getTypes(schema).filter(t => 'type' in t && t['type'] === 'error')

export const getMethods = (
  schema: Record<string, unknown>
): { name: string; obj: Record<string, unknown> }[] => {
  const methods =
    'messages' in schema
      ? (schema['messages'] as Record<string, unknown>)
      : { messages: {} }

  const defs: { name: string; obj: Record<string, unknown> }[] = []
  for (const name in methods) {
    if (Object.hasOwn(methods, name)) {
      defs.push({ name, obj: methods[name] as Record<string, unknown> })
    }
  }
  return defs
}

// convert CamelCase to snake_case
export const camelToSnake = (str: string) => {
  if (!str) {
    return str
  }
  return (
    str[0].toLowerCase() +
    str.slice(1).replaceAll(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
  )
}

export const makeFileName = (
  schema: Record<string, unknown>,
  lang: Lang = 'ts',
  fileNameMaker: (lang: Lang, fileName: string) => string = (lang, fileName) =>
    fileName
) =>
  lang === 'ts' || lang === 'py'
    ? `${camelToSnake(getProtoName(schema))}.py`
    : fileNameMaker(lang, getProtoName(schema))
