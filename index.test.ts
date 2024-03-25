import postcss from 'postcss'
import { equal, throws } from 'node:assert'
import { test, describe } from 'node:test'

import plugin from './src'
import { compute } from './src/lib/compute';

describe('plugin check', () => {
  async function run(input, output, opts = {}) {
    let result = await postcss([plugin(opts)]).process(input, { from: undefined })
    console.log(result.css)
    equal(result.css, output)
    equal(result.warnings().length, 0)
  }

  test('should not modify any and return same prop', async () => {
    const input = 'testClass { color: red }'
    const output = 'testClass { color: red }'
    await run(input, output, { })
  })

  test('should transform color values in filter property', async () => {
    const input = 'testClass { filter: color-to-filter(#ff0000) }'
    const output = 'testClass { filter: invert(12%) sepia(95%) saturate(7398%) hue-rotate(1deg) brightness(100%) contrast(110%); }'
    await run(input, output, { })
  })

  test('should replace with invalid value', async () => {
    const input = 'testClass { filter: color-to-filter(invalid) }'
    const output = 'testClass { filter: invalid }'

    await run(input, output, { })
  })

  test('should handle if color-to-filter in custom properties', async () => {
    const input = ':root { --main-color: color-to-filter(#ff0000); } testClass { filter: var(--main-color) }'
    const output = ':root { --main-color: brightness(0) saturate(100%) invert(16%) sepia(96%) saturate(7468%) hue-rotate(0deg) brightness(98%) contrast(103%); } testClass { filter: var(--main-color) }'
    await run(input, output, { })
  })

  test('should handle if pass to color-to-filter custom property', async () => {
    const input = ':root { --main-color: #ff0000; } testClass { filter: color-to-filter(var(--main-color)) }'
    const output = ':root { --main-color: #ff0000; } testClass { filter: brightness(0) saturate(100%) invert(16%) sepia(96%) saturate(7468%) hue-rotate(0deg) brightness(98%) contrast(103%) }'
    await run(input, output, { })
  })

  test('should handle rgba values', async () => {
    const input = ':root { --main-color: rgb(255, 0, 0); } testClass { filter: color-to-filter(var(--main-color)) }'
    const output = ':root { --main-color: rgb(255, 0, 0); } testClass { filter: brightness(0) saturate(100%) invert(16%) sepia(96%) saturate(7468%) hue-rotate(0deg) brightness(98%) contrast(103%) }'
    await run(input, output, { })
  })
})
