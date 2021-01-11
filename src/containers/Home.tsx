import * as React from 'react'
import { useCallback } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import HomeComponent from '../components/pages/Home'

type Props = RouteComponentProps

export const useHandlers = ({ history }: RouteComponentProps) => ({
  onSubredditLinkClick: useCallback(
    (
      event:
        | React.MouseEvent<HTMLAnchorElement>
        | React.KeyboardEvent<HTMLAnchorElement>
    ) => {
      event.preventDefault()
      return history.push('/subreddit')
    },
    [history]
  ),
})

const Home = ({ location, history, match }: Props) => {
  const { onSubredditLinkClick } = useHandlers({
    location,
    history,
    match,
  })
  return <HomeComponent onSubredditLinkClick={onSubredditLinkClick} />
}

export default Home
