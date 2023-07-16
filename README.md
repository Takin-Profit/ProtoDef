# ProtoDef

(intetionally)  unsupported avro idl language syntax.

* @namespace, ( only a single top level namespace is allowed for each protocol )
* @aliase
* fixed length fields
* @java-class
* @order
* null union shorthand, E.G.  `string?` use `{ string, null }` instead
* throws,  use `union { SomeType, SomeError } ` instead
* oneway
* @logicalType
* default values , this should be defined in your code, not the api.
