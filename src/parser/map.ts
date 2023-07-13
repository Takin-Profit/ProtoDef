// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
/** Avro Map Type */
export type AvroMap = {
  values: FieldType
} & { __brand: 'AvroMap' }
