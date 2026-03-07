import { languages } from './ui';
import en from './locales/en.json';
import tr from './locales/tr.json';
import ar from './locales/ar.json';

export const ui: Record<keyof typeof languages, Record<string, string>> = {
  en,
  tr,
  ar,
};
