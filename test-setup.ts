import { plugin } from 'bun'
import { beforeAll, afterAll } from 'bun:test'
const removeFlowTypes = require('esbuild-plugin-flow')

plugin(removeFlowTypes(/\.jsx?$/))

beforeAll(() => {
  // global setup
})

afterAll(() => {
  // global teardown
})
