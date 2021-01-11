import * as React from 'react'
import { render } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from 'history'

import { useSubreddit } from './useSubreddit'

import { api } from '../modules/subreddit'
import TestProvider from '../__fixtures__/TestProvider'
import createSink from '../__fixtures__/createSink'
import renderHookWithWrapper from '../__fixtures__/renderHookWithWrapper'
import { createSubreddit } from '../__fixtures__/subreddit'

describe('<Subreddit />', () => {
  const mock = new MockAdapter(api)
  afterEach(mock.restore)
  const Comp = createSink((props) => props)

  it('should be passed redux state', async () => {
    const paths = ['/subreddit']
    const mockData = createSubreddit()
    mock.onGet('https://www.reddit.com/r/cat.json').reply(200, mockData)

    render(<TestProvider component={Comp} paths={paths} />)

    const history = createMemoryHistory()
    const mockHistoryPush = jest.fn().mockName('history.push')
    history.push = mockHistoryPush

    const location = {
      hash: '#',
      pathname: '/',
      search: '&value=cat',
      state: undefined,
    }
    const match = {
      params: {},
      isExact: true,
      path: '/',
      url: '/',
    }

    const { result, waitForNextUpdate } = renderHookWithWrapper(
      () => useSubreddit({ history, location, match }),
      {
        component: Comp,
        paths,
        search: '&value=cat',
      }
    )
    expect(result.current.isLoading).toBeTruthy()
    await waitForNextUpdate()

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.posts).toStrictEqual(
      mockData.data.children.map(
        ({ data: { title, thumbnail, selftext, permalink } }) => ({
          title,
          thumbnail,
          selftext,
          permalink,
        })
      )
    )
    expect(result.current.subreddit).toBe('cat')
  })

  it('should render initialState', () => {
    const paths = ['/subreddit']
    mock.onGet('https://www.reddit.com/r/cat.json').reply(200, [])

    render(<TestProvider component={Comp} paths={paths} />)
    // const { history, match, location } = screen.findAllByRole(Comp).props()

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

    const { result } = renderHookWithWrapper(
      () => useSubreddit({ history, location, match }),
      {
        component: Comp,
        paths,
      }
    )
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.posts).toStrictEqual([])
    expect(result.current.subreddit).toBe('')
  })
})
