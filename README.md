# NativeDB

A simple, lightweight local database for Node.js that stores data in a JSON file on your storage.

## Installation

To install `NativeDB`, run the following command:

```
npm install native-db
```

## Quick Start

Here is an example of how to use `NativeDB` to create a new database and store, retrieve, and delete data from it:

``` javascript

const NativeDB = require('native-db');

const db = new NativeDB('/path/to/storage/file.json');

db.set('key1', 'value1');
db.set('key2', { foo: 'bar' });

console.log(db.get());  // { key1: 'value1', key2: { foo: 'bar' } }
console.log(db.get('key1', 'key2'));  // { key1: 'value1', key2: { foo: 'bar' } }
console.log(db.get('key1'));  // { key1: 'value1' }

db.remove('key1');
console.log(db.get());  // { key2: { foo: 'bar' } }

db.clear();
console.log(db.get());  // {}

```
## API

### `new NativeDB(filePath, options)`

Creates a new instance of the `NativeDB` class.

#### Parameters

- `filePath` (string): The path of the file to use as storage.
- `options` (object, optional): Configuration options.
  - `asyncWrite` (boolean, optional): Enables asynchronous writes to the storage file. Default: `false`.
  - `syncOnWrite` (boolean, optional): Makes the storage be written to disk after every modification. Default: `true`.
  - `jsonSpaces` (number, optional): How many spaces to use for indentation in the output json file. Default: `4`.

#### Return value

An instance of the `NativeDB` class.

### `NativeDB.set(key, value)`

Creates or modifies a key in the database.

#### Parameters

- `key` (string): The key to create or alter.
- `value` (object): Whatever to store in the key. You name it, just keep it JSON-friendly.

#### Return value

None.

### `NativeDB.get([key1], [key2], ...)`

Extracts the value of one or more keys from the database.

#### Parameters

- `[key1]` (string, optional): The key to search for. If not provided, returns the entire storage object.
- `[key2]` (string, optional): Another key to search for.
- `...` (string, optional): More keys to search for.

#### Return value

An object containing the values of the keys or the entire storage object if no keys were provided.

### `NativeDB.remove(key1, [key2], ...)`

Removes one or more keys from the database.

#### Parameters

- `key1` (string): The key to remove.
- `[key2]` (string, optional): Another key to remove.
- `...` (string, optional): More keys to remove.

#### Return value

None.

### `NativeDB.clear()`

Removes all keys from the database.

#### Parameters

None.

#### Return value

None.

### `NativeDB.sync()`

Writes the current state of the storage object to the storage file.

#### Parameters

None.

#### Return value

None.

## License

`NativeDB` is released under the MIT License. See the [LICENSE](https://github.com/Marius-Heinrich/NativeDB/LICENSE.md) file for more details.
