import { useCallback, useEffect } from 'react'
import { parse } from 'query-string'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { Props as ViewProps } from '../components/pages/Subreddit'
import { ReduxState } from '../modules'
import { fetchSubreddit, queries, SubRedditModel } from '../modules/subreddit'

export const mapProps =
  ({ location }: RouteComponentProps) =>
  ({ subreddit }: ReduxState) => {
    const { value } =
      location.search === '' ? { value: '' } : parse(location.search)
    const posts = queries.getPosts(subreddit.children)
    return { isLoading: subreddit.isLoading, posts, subreddit: value }
  }

export type MapProps = ReturnType<typeof mapProps>

export type MapDispatch = {
  fetchSubreddit: (subreddit: string) => Promise<SubRedditModel>
}

export const mapDispatch = (
  dispatch: ThunkDispatch<ReduxState, null, AnyAction>
): MapDispatch => ({
  fetchSubreddit: (subbreddit) => dispatch(fetchSubreddit(subbreddit)),
})

export const useSubredditHandlers = ({
  history,
  location,
}: RouteComponentProps) => {
  const onSubmit: ViewProps['onSubmit'] = useCallback(
    (data) => {
      const { value } = parse(location.search)
      if (value === data.subreddit) {
        return
      }

      const nextPath = `/subreddit?value=${data.subreddit}`
      history.push(nextPath)
    },
    [location] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const onLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, permalink: string) => {
      event.preventDefault()
      return window.open(`https://www.reddit.com/${permalink}`)
    },
    []
  )

  return { onLinkClick, onSubmit }
}

type UseSubredditEffectProps = {
  fetch: MapDispatch['fetchSubreddit']
}

const useSubredditEffect = ({
  location: { search },
  fetch,
}: RouteComponentProps & UseSubredditEffectProps) => {
  const { value } = parse(search)

  useEffect(() => {
    if (value) {
      fetch(value)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
}

export const useSubreddit = ({
  location,
  history,
  match,
}: RouteComponentProps) => {
  const dispatch = useDispatch()

  const { isLoading, posts, subreddit } = useSelector(
    mapProps({ location, history, match })
  )

  const { onLinkClick, onSubmit } = useSubredditHandlers({
    history,
    location,
    match,
  })
  const { fetchSubreddit: fetch } = mapDispatch(dispatch)

  useSubredditEffect({
    history,
    location,
    match,
    fetch,
  })

  return { onLinkClick, onSubmit, isLoading, posts, subreddit }
}
