# ChangeLog [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/changelog-io.svg?style=flat
[BuildStatusURL]: https://github.com/coderaiser/changelog-io/actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/changelog-io/workflows/Node%20CI/badge.svg
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/changelog-io "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]: https://coveralls.io/github/coderaiser/changelog-io?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/changelog-io/badge.svg?branch=master&service=github

Generate changelog with one command.

## Install

```
npm i changelog-io -g
```

## How it works?

If you already have tags and use conventions like this:

- `feature(scope) command message`;
- `fix(scope) commit message`;
- `docs(scope) commit message`;
- `chore(scope) commit message`;
- `refactor(scope) commit message`;

Or:

- `feature: scope: command message`;
- `fix: scope: commit message`;
- `docs: scope: commit message`;
- `chore: scope: commit message`;
- `refactor: scope: commit message`;

`feature` and `fix` commit messages from previous tag will print out to screen.

## How to use?

```
changelog                       # to log output
changelog version > ChangeLog   # to save output to ChangeLog
```

## API

```js
import changelog from 'changelog-io';

changelog('v1.0.0');
// returns
`
2021.08.25

feature:
- (package) eslint-plugin-putout v9.2.1
- (package) putout v19.0.0
- (changelog) convert ot ESM
`;
```

## License

MIT
