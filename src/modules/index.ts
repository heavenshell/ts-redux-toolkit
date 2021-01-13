import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
  StoreEnhancer,
} from 'redux'
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk'

import subreddit, { State as SubredditState } from './subreddit'

export type ReduxState = {
  subreddit: SubredditState
}

export const rootReducer = combineReducers({
  subreddit,
})

export const configureStore = (initialState?: ReduxState) => {
  return createStore(
    rootReducer,
    initialState || {},
    composeWithDevTools(
      applyMiddleware(thunk as ThunkMiddleware<ReduxState, AnyAction, null>)
    ) as StoreEnhancer<{
      dispatch: ThunkDispatch<ReduxState, null, AnyAction>
    }>
  )
}
