import * as React from 'react'
import { render } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history'

import { useHandlers } from './Home'

import createSink from '../__fixtures__/createSink'
import TestProvider from '../__fixtures__/TestProvider'

describe('<Home />', () => {
  const Comp = createSink((props) => props)

  it('should onSubredditLinkClick', () => {
    render(<TestProvider component={Comp} paths={['/']} />)
    const history = createMemoryHistory()
    const mockHistoryPush = jest.fn().mockName('history.push')
    history.push = mockHistoryPush

    const location = {
      hash: '#',
      pathname: '/',
      search: '',
      state: undefined,
    }
    const match = {
      params: {},
      isExact: true,
      path: '/',
      url: '/',
    }
    history.push = mockHistoryPush

    const mockClickEvent = {
      preventDefault: jest.fn().mockName('preventDefault'),
    }

    const { result } = renderHook(() =>
      useHandlers({ history, location, match })
    )
    const { onSubredditLinkClick } = result.current
    act(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubredditLinkClick(mockClickEvent as any)
    })

    expect(mockClickEvent.preventDefault).toHaveBeenCalled()
    expect(mockHistoryPush).toHaveBeenCalledTimes(1)
    expect(mockHistoryPush).toHaveBeenCalledWith('/subreddit')
  })
})
