import { plugin } from 'bun'
import { beforeAll, afterAll } from 'bun:test'

import ts from 'typescript'

console.log(
  'TS:',
  Object.keys(ts).filter((key) => key.startsWith('transpile')),
)

// import { readFile } from 'fs/promises'
// const removeFlowTypes = require('esbuild-plugin-flow')
// import commonjs from '@hyrious/esbuild-plugin-commonjs'
import { cjsToEsmTransformer } from 'cjstoesm'
import { statSync } from 'fs'

// console.log(Object.keys(commonjs))
// console.log(commonjs)

// plugin(removeFlowTypes(/\.jsx?$/))

const force = true

// plugin(commonjs())

plugin({
  name: 'flow-types',
  async setup(build) {
    var flowRemoveTypes = require('flow-remove-types')
    var { readFile } = require('fs').promises

    const { cjsToEsm } = await import('cjstoesm')
    const { runTransform } = require('esm-to-cjs')

    build.onLoad({ filter: /\.jsx?$/ }, async (args) => {
      const source = await readFile(args.path, 'utf8')
      let output = source
      if (force) {
        output = flowRemoveTypes('// @flow\n' + source, { pretty: true })
      } else {
        if (
          source.slice(0, 8) === '// @flow' ||
          source.match(/^\/\*.*@flow.*\*\//s)
        ) {
          output = flowRemoveTypes(source, { pretty: true })
        }
      }
      let contents = output.toString().replace(/static\s+\+/g, 'static ')

      console.log(`path: ${args.path}`)

      // if (true) {
      //   return {
      //     contents: runTransform(contents),
      //     loader: 'jsx',
      //   }
      // }

      if (true) {
        const result = ts.transpileModule(contents, {
          transformers: cjsToEsm(),
          compilerOptions: {
            module: ts.ModuleKind.ES2020,
          },
        })
        return {
          contents: result.outputText,
          loader: 'jsx',
        }
      }

      //       console.log('----------------------------------------')
      //       if (args.path.endsWith(`react-native/index.js`)) {
      //         contents = `
      // module.exports = {
      //   // Components

      // }`
      //       }
      // console.log(args.path, contents)
      console.log(args.path)
      return {
        contents,
        loader: 'jsx',
      }
    })
  },
})

beforeAll(() => {
  // global setup
})

afterAll(() => {
  // global teardown
})
