import { render, screen } from '@testing-library/react-native'

import App from './App'

test('Should render App', async () => {
  render(<App />)
  expect(
    await screen.findByText(/Read the docs to discover what to do next/),
  ).toBeDefined()
})
