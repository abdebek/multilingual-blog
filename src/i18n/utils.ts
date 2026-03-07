import { languages, defaultLang } from './ui';
import uiData from './ui.json';

export const ui = uiData as Record<keyof typeof languages, Record<string, string>>;
