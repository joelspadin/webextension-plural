import { browser } from 'webextension-polyfill-ts';
import _plural from 'plurals-cldr';

export interface PluralOptions {
    /**
     * A string or list of strings to insert into the message.
     * If omitted, `value` is passed as the only substitution parameter.
     */
    substitutions?: any | any[];

    /**
     * Set to `true` to use cardinal forms (1st, 2nd, 3rd, ...) instead of
     * ordinal forms (1, 2, 3, ...).
     */
    ordinal?: boolean;

    /**
     * A string separating the plural forms in the message string. Defaults to
     * `|` if omitted.
     */
    separator?: string;
}

/**
 * Gets a variant of a message based on the plural form of a given number.
 *
 * @param message The key of a message in messages.json containing a list of
 *  `separator`-delimited strings for each of the CLDR plural forms for the
 *  current locale in the order, `zero`, `one`, `two`, `few`, `many`, `other`,
 *  with forms not used by the locale omitted.
 * @param value A number to determine which plural form to use.
 * @param options Optional configuration.
 */
export default function plural(message: string, value: number | string, options?: PluralOptions) {
    const { substitutions, ordinal, separator } = getOptions(options);

    const strings = getStrings(message, substitutions || [value], separator);
    const index = getIndex(value, ordinal);

    if (index < strings.length) {
        return strings[index];
    } else {
        console.warn(`Not enough plural forms in message "${message}". Expected at least ${index + 1} forms.`);
        return strings[0];
    }
}

function getOptions(options?: PluralOptions) {
    return {
        substitutions: undefined,
        ordinal: false,
        separator: '|',
        ...options,
    };
}

function getStrings(message: string, substitutions: any[], separator: string) {
    return browser.i18n.getMessage(message, substitutions).split(separator);
}

function getIndex(value: number | string, ordinal: boolean) {
    const language = browser.i18n.getUILanguage();
    const dashIndex = language.indexOf('-');
    const locale =  (dashIndex < 0) ? language : language.substr(0, dashIndex);

    const index = (ordinal ? _plural.ordinal : _plural).indexOf(locale, value);
    if (index < 0) {
        console.warn(`Locale "${locale}" is not supported.`);
        return 0;
    }

    return index;
}
