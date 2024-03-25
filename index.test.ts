import postcss from 'postcss'
import { equal } from 'node:assert'
import { test } from 'node:test'

import plugin from './src'

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: undefined })
  console.log(result.css)
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

test('should return same props', async () => {
  const input = 'testClass { color: red }'
  const output = 'testClass { color: red }'
  await run(input, output, { })
})

test('should transform color values', async () => {
  const input = 'testClass { filter: color-to-filter(#ff0000) }'
  const output = 'testClass { filter: brightness(0) saturate(100%) invert(16%) sepia(96%) saturate(7468%) hue-rotate(0deg) brightness(98%) contrast(103%) }'
  await run(input, output, { })
})

test('should handle invalid color values', async () => {
  const input = 'testClass { filter: color-to-filter(invalid) }'
  const output = 'testClass { filter: color-to-filter(invalid) }'
  await run(input, output, { })
})

test('should handle in custom properties', async () => {
  const input = ':root { --main-color: color-to-filter(#ff0000); } testClass { filter: var(--main-color) }'
  const output = ':root { --main-color: brightness(0) saturate(100%) invert(16%) sepia(96%) saturate(7468%) hue-rotate(0deg) brightness(98%) contrast(103%); } testClass { filter: var(--main-color) }'
  await run(input, output, { })
})

test('should handle with custom properties argument', async () => {
  const input = ':root { --main-color: #ff0000; } testClass { filter: color-to-filter(var(--main-color)) }'
  const output = ':root { --main-color: #ff0000; } testClass { filter: brightness(0) saturate(100%) invert(16%) sepia(96%) saturate(7468%) hue-rotate(0deg) brightness(98%) contrast(103%) }'
  await run(input, output, { })
})
