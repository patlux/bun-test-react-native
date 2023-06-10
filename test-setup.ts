import { plugin } from 'bun'
import { beforeAll, afterAll } from 'bun:test'
// import { readFile } from 'fs/promises'
// const removeFlowTypes = require('esbuild-plugin-flow')

// plugin(removeFlowTypes(/\.jsx?$/))

const force = false

plugin({
  name: 'flow-types',
  async setup(build) {
    var flowRemoveTypes = require('flow-remove-types')
    var { readFile } = require('fs').promises

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
      const contents = output.toString().replace(/static\s+\+/g, 'static ')
      console.log(contents)
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
