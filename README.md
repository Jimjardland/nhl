Breaking out some code from my [NHL graphql api](https://github.com/Jimjardland/pokechecked) from earlier.

Making it an npm package, mainly for building [Pokechecked in React Native](https://github.com/Jimjardland/pokechecked-app)

# Installating

```bash
  npm i @jimjardland/nhl
```

# Usage

```javascript
const { getHighlights } = require('@jimjardland/nhl')

const highlights = await getHighlights()
```

# Building

```
  git clone https://github.com/Jimjardland/nhl
```

Change to nhl directory:

```bash
   cd nhl
```

Install dev dependencies

```bash
  npm i
```

Use one of the following to build and test

```
  npm start             # Builds and and runs dist/lib/index.js
  npm run test          # Run unit tests
  npm run build         # builds
```
