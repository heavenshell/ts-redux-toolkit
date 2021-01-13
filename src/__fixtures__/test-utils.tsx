import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { rootReducer } from '../modules'

function render(
  ui: React.ReactElement,
  {
    initialState,
    store = createStore(rootReducer, initialState),
    ...renderOptions
  }: any = {} // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'

// override render method
export { render }
