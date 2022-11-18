import type about from './locales/en/about.json';
import type common from './locales/en/common.json';
import type components from './locales/en/components.json';
import type system from './locales/en/system.json';

export interface I18nNamespaces {
  common: typeof common;
  components: typeof components;
  about: typeof about;
  system: typeof system;
}
