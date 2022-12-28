# @armit/generate-template-files

A simple generator that is independent of any language. Create custom boilerplate, scaffolding, skeleton, and templating code files that you need to create over and over again. All you need is NodeJS installed to get started.

## Install globally

- `npm install @armit/generate-template-files`
- `yarn add @armit/generate-template-files`

## Module/Programmatic Usage

1. Create a file called `generate.mjs`( Note that this file name is flexible).
2. In that file, add in the example code below.
3. Run node generate.js within Terminal (Mac) or Powershell (Win) once you've added your template files.

```typescript
import { generateTemplateFiles } from "@armit/generate-template-files";

const config = require("../package.json");

generateTemplateFiles([
  {
    option: "Create Redux Store",
    defaultCase: "(pascalCase)",
    entry: {
      folderPath: "./tools/templates/react/redux-store/",
    },
    stringReplacers: [
      "__store__",
      { question: "Insert model name", slot: "__model__" },
    ],
    output: {
      path: "./src/stores/__store__(lowerCase)",
      pathAndFileNameDefaultCase: "(kebabCase)",
      overwrite: true,
    },
  },
  {
    option: "Create Reduce Action",
    defaultCase: "(pascalCase)",
    entry: {
      folderPath: "./tools/templates/react/redux-store/__store__Action.ts",
    },
    stringReplacers: ["__store__", "__model__"],
    dynamicReplacers: [
      { slot: "__version__", slotValue: config.version },
      { slot: "__description__", slotValue: config.description },
    ],
    output: {
      path: "./src/stores/__store__/__store__(lowerCase)/__store__(pascalCase)Action.ts",
      pathAndFileNameDefaultCase: "(kebabCase)",
    },
    onComplete: (results) => {
      console.log(`results`, results);
    },
  },
]);
```

As outlined in the examples folder, I prefer to create a tools folder and place generate.js w/ templates files in there. Additionally, I'll add a script task ("generate": "node ./tools/generate.ts") to my package.json file for convienent running of the generator using npm run generate or yarn generate.

```text
┣━ package.json
┣━ src
┗━ tools/
   ┣━ generate.ts
   ┗━ templates/
      ┣━ SomeFile.ts
      ┗━ __name__(pascalCase)Action.ts
```

## Contributing

Contributions are happily accepted. I respond to all PR's and can offer guidance on where to make changes. For contributing tips see CONTRIBUTING.md
