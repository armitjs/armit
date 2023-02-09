/* eslint-disable @typescript-eslint/consistent-type-imports */
type Messages = typeof import('../locales/en.json');

// Declaring this interface provides type safety for message keys
type IntlMessages = Messages;
