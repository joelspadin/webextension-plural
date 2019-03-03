# WebExtension Plural

Localize plurals using browser.i18n and [plurals-cldr](https://github.com/nodeca/plurals-cldr).

## Install

```shell
$ npm install -S @spadin/webextension-plural
```

## Usage

Call `plural()` with the key of a message in the current locale's messages.json and the number to pluralize. If `options.substitutions` is not set, this number will automatically be provided as a substitution parameter.

The message should contain one string per [CLDR plural form](http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html) for the current locale in the order, `zero`, `one`, `two`, `few`, `many`, `other`, with forms not used by the locale omitted. The strings should be separated by the `|` character by default, or you may set `options.separator` to use a different string.

By default this uses cardinal forms. Set `options.ordinal` to `true` to use ordinal forms instead.

### _locale/en/messages.json
```json
{
    "duck_cardinal": {
        "message": "There is $num$ duck.|There are $num$ two ducks.",
        "description": "Example for cardinal numbers.",
        "placeholders": {
            "num": {
                "content": "$1",
                "description": "The number of ducks"
            }
        }
    },
    "item_ordinal": {
        "message": "This is the $num$st $item$.|This is the $num$nd $item$.|This is the $num$rd $item$.|This is the $num$th $item$.",
        "description": "Example for ordinal numbers.",
        "placeholders": {
            "num": {
                "content": "$1",
                "description": "The ordinal number of the item"
            },
            "item": {
                "content": "$2",
                "description": "The type of item"
            }
        }
    }
}
```

### script.ts

```typescript
import plural from '@spadin/webextension-plural';

plural('duck_cardinal', 0); // returns 'There are 0 ducks.'
plural('duck_cardinal', 1); // returns 'There is 1 duck.'
plural('duck_cardinal', 2); // returns 'There are 2 ducks.'
plural('duck_cardinal', 2.5); // returns 'There are 2.5 ducks.'

plural('duck_cardinal', 1, { substitutions: ['one'] }); // returns 'There is one duck.'

// returns 'This is the 2nd duck.'
let index = 2;
plural('item_ordinal', index, {
    substitutions: [index, 'duck'],
    ordinal: true,
});

// returns 'This is the 1st dog.'
index = 1;
plural('item_ordinal', index, {
    substitutions: [index, 'dog'],
    ordinal: true,
});
```