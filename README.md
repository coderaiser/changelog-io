# ChangeLog

Generate changelog with one command.

## Install

```
npm i changelog-io -g
```

## How it works?

If you already have tags and use conventions like this:

- feature(scrope) command message
- fix(scope) commit message
- docs(scope) commit message
- chore(scope) commit message
- refactor(scope) commit message

`feature` and `fix` commit messages from previous
tag would be print out to screen.

## How to use?

```
changelog                       # to log output
changelog version > ChangeLog   # to save output to ChangeLog
```

## API

```js
import changelog from 'changelog-io';

await changelog('v1.0.0');
// returns
`
2021.08.25

feature:
- (package) eslint-plugin-putout v9.2.1
- (package) putout v19.0.0
- (changelog) convert ot ESM
`
```

## License

MIT

