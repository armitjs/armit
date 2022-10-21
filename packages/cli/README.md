# @armit/cli

A tool the modern for rapidly building command line armitjs apps

## Install globally

- `npm i -g @armit/cli`

## Module/Programmatic Usage

- `yarn add @armit/cli`

Add this package to package dependencies linked to your app, just import them like regular packages:

```typescript
import { bootstrap } from "@armit/cli";

bootstrap().then((cli) => {
  cli.parse(process.argv.slice(2));
});
```

## Contributing

Contributions are happily accepted. I respond to all PR's and can offer guidance on where to make changes. For contributing tips see CONTRIBUTING.md
