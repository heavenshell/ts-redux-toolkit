import { ReduxState } from '../modules'
import { State as SubredditState } from '../modules/subreddit'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultState = (param: any) => param || { isLoading: false }

export const configureInitialState = (params: {
  subredditState?: SubredditState
}): ReduxState => ({
  subreddit: defaultState(params.subredditState),
})
