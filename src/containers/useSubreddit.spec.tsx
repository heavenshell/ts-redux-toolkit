import * as React from 'react'
import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history'

import * as hooks from './useSubreddit'
import Subreddit from './Subreddit'

import { ReduxState } from '../modules'
import createSink from '../__fixtures__/createSink'
import { configureInitialState } from '../__fixtures__/state'
import TestProvider from '../__fixtures__/TestProvider'

describe('containers/useSubreddit', () => {
  const Comp = createSink((props) => props)

  it('should call fetchSubreddit - value given', () => {
    const fetchSubreddit = jest
      .fn()
      .mockName('fetchSubreddit')
      .mockResolvedValue('fetch success')

    jest
      .spyOn(hooks, 'mapDispatch')
      .mockImplementation(() => ({ fetchSubreddit }))

    const subredditState = {
      isLoading: false,
    }
    const initialState: ReduxState = configureInitialState({ subredditState })

    render(
      <TestProvider
        component={Subreddit}
        paths={['/subreddit']}
        search="value=cat"
        initialState={initialState}
      />
    )

    const history = createMemoryHistory()
    const mockHistoryPush = jest.fn().mockName('history.push')
    history.push = mockHistoryPush
    const location = {
      hash: '#',
      pathname: '/subreddit',
      search: '',
      state: undefined,
    }
    const match = {
      params: {},
      isExact: true,
      path: '/subreddit',
      url: '/',
    }

    // const { history, location, match } = renderer.find(Subreddit).props()
    renderHook(() => {
      hooks.useSubreddit({ history, location, match })
    })

    expect(fetchSubreddit).toBeCalledTimes(1)
  })

  it('should not call fetchSubreddit - value not given', () => {
    const fetchSubreddit = jest
      .fn()
      .mockName('fetchSubreddit')
      .mockResolvedValue('fetch success')

    jest
      .spyOn(hooks, 'mapDispatch')
      .mockImplementation(() => ({ fetchSubreddit }))

    const subredditState = {
      isLoading: false,
    }
    const initialState: ReduxState = configureInitialState({ subredditState })

    render(
      <TestProvider
        component={Subreddit}
        paths={['/subreddit']}
        initialState={initialState}
      />
    )
    const history = createMemoryHistory()
    const mockHistoryPush = jest.fn().mockName('history.push')
    history.push = mockHistoryPush
    const location = {
      hash: '#',
      pathname: '/subreddit',
      search: '',
      state: undefined,
    }
    const match = {
      params: {},
      isExact: true,
      path: '/subreddit',
      url: '/',
    }

    renderHook(() => {
      hooks.useSubreddit({ history, location, match })
    })

    expect(fetchSubreddit).toBeCalledTimes(0)
  })

  it('should call onLinkClick', () => {
    render(<TestProvider component={Comp} paths={['/subreddit']} />)

    const history = createMemoryHistory()
    const mockHistoryPush = jest.fn().mockName('history.push')
    history.push = mockHistoryPush
    const location = {
      hash: '#',
      pathname: '/subreddit',
      search: '',
      state: undefined,
    }
    const match = {
      params: {},
      isExact: true,
      path: '/',
      url: '/',
    }
    const { result } = renderHook(() => {
      return hooks.useSubredditHandlers({ history, location, match })
    })
    const { onLinkClick } = result.current

    const mockClickEvent = {
      preventDefault: jest.fn().mockName('preventDefault'),
    }
    window.open = jest.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onLinkClick(mockClickEvent as any, 'cat')
    expect(window.open).toBeCalledWith('https://www.reddit.com/cat')
  })

  it('should onSubmit - add query params to location.search', () => {
    render(<TestProvider component={Comp} paths={['/subreddit']} />)
    const history = createMemoryHistory()
    const mockHistoryPush = jest.fn().mockName('history.push')
    history.push = mockHistoryPush
    const location = {
      hash: '#',
      pathname: '/subreddit',
      search: '',
      state: undefined,
    }
    const match = {
      params: {},
      isExact: true,
      path: '/',
      url: '/',
    }

    expect(location.search).toBe('')

    const { result } = renderHook(() => {
      return hooks.useSubredditHandlers({ history, location, match })
    })
    const { onSubmit } = result.current

    const resetForm = jest.fn().mockName('resetForm')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit({ subreddit: 'cat' }, { resetForm } as any)

    // const {
    //   location: { search },
    // } = renderer.find(Comp).props()
    // expect(search).toBe('?value=cat')
  })
})
