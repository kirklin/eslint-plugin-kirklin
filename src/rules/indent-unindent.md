# indent-unindent

Enforce consistent indentation style for content inside template string with `unindent` tag.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
import { unindent } from '../utils'

const cases = [
  unindent`
const foo = {
  bar: 'baz', qux: 'quux',
  fez: 'fum'
}`,
  unindent`
      if (true) {
        console.log('hello')
      }`,
]
```

<!-- eslint-skip -->
```js
// 👍 good
import { unindent } from '../utils'

const cases = [
  unindent`
    const foo = {
      bar: 'baz', qux: 'quux',
      fez: 'fum'
    }
  `,
  unindent`
    if (true) {
      console.log('hello')
    }
  `,
]
```

By default, this rule applies to template tags named `unindent`, `unIndent`, or `$`. It is specifically designed for the `unindent` utility function, which removes leading and trailing empty lines from a template string and strips common indentation from each line. This rule adjusts only the content within the template string without affecting the runtime result.
