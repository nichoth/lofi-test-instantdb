# lofi test instantDB

Trying instantDB.

[See the vanilla docs](https://docs.instantdb.com/docs/start-vanilla)

[state.ts](./src/state.ts) goes through [the instant QL tutorial](https://docs.instantdb.com/docs/instaql)

## develop
Create a file `.env` with [the app ID from instant](https://www.instantdb.com/dash).

```sh
VITE_APP_ID="123abc..."
```

This will start a local lambda function server as well as a `vite` instance.

```sh
npm start
```

### test data
You would want to uncomment [the line where we create test data](https://github.com/nichoth/lofi-test-instantdb/blob/main/src/state.ts#L73). Only run it once (no refreshes), because otherwise it will create duplicate data.

Import `doTransaction` from the file [src/mock-data.ts](./src/mock-data.ts).
