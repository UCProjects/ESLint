# eslint-config-ucprojects

Shared ESLint flat config for the UCProjects.

## Pieces

| Export | What it is |
| --- | --- |
| `default` | `ignores` + `base` + `node` + `mocha`, a sensible starting point for a Node project |
| `base` | airbnb-base and the shared rule overrides |
| `ignores` | `node_modules`, `dist`, `.vscode`, `*.d.ts` and `*.ignore*` |
| `node` | Node globals |
| `mocha` | mocha globals and relaxed rules for `test/**` |
| `commonjs` | `sourceType: 'commonjs'`, with `*.mjs` kept as modules |
| `typescript` | the TypeScript parser and rules for `**/*.ts` |

## Use

```
npm install --save-dev github:UCProjects/ESLint#semver:^1.0.0
```

Then in the project's `eslint.config.mjs`:

```js
import shared, { commonjs } from 'eslint-config-ucprojects';

export default [...shared, ...commonjs];
```

An ES module project can use the default export as it is. Project-specific rules (for example `import/extensions` or the browser globals of a userscript) go after the spread.

## Install notes

- `eslint-config-airbnb-base` still declares ESLint 7/8 as its peer. The project that installs this package needs the same override this package uses:

  ```json
  "overrides": {
    "eslint-config-airbnb-base": { "eslint": "$eslint" }
  }
  ```

- The project needs `eslint` 9 itself. Everything else comes with this package.
