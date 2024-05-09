# indent-unindent

Enforce consistent indentation style for content inside template string with `unindent` tag.

## Rule Details

<!-- eslint-skip -->
```js
// 👎 bad
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
