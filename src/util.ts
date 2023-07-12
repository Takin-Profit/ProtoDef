// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export type Lang = 'ts' | 'py'
export const hasDoc = (schema: object) =>
  Object.prototype.hasOwnProperty.call(schema, 'doc')

export const hasNameSpace = (schema: object) =>
  Object.prototype.hasOwnProperty.call(schema, 'namespace')

const protocol = 'protocol'

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

export const protoName = (schema: Record<string, unknown>): string =>
  schema[protocol] as string

export const makeFileName = (
  schema: Record<string, unknown>,
  lang: Lang = 'ts',
  fileNameMaker: (lang: Lang, fileName: string) => string = (lang, fileName) =>
    fileName
) =>
  lang === 'ts' || lang === 'py'
    ? `${camelToSnake(protoName(schema))}.py`
    : fileNameMaker(lang, protoName(schema))
