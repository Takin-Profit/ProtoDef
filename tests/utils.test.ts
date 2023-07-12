/* eslint-disable i18n-text/no-en */
// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import test, { group } from 'japa'
import { camelToSnake } from '../src/index.js'

group('Test camelToSnake', () => {
  test('should convert camelCase to snake_case', assert => {
    const input = 'thisIsATest'
    const expected = 'this_is_a_test'
    const result = camelToSnake(input)
    assert.equal(result, expected)
  })

  test('should convert CamelCase to snake_case', assert => {
    const input = 'ThisIsATest'
    const expected = 'this_is_a_test'
    const result = camelToSnake(input)
    assert.equal(result, expected)
  })

  test('should return an empty string when input is empty', assert => {
    const input = ''
    const expected = ''
    const result = camelToSnake(input)
    assert.equal(result, expected)
  })
})
