// Copyright 2023 Takin Profit. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

/** represents an Avro Record field possible type */
export type FieldType =
  | TypeName
  | AvroMap
  | AvroUnion
  | AvroArray
  | AvroPrimitive
  | AvroPrimitive[]
