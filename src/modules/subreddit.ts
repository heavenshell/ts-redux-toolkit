import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'
import { ActionCreator, AnyAction } from 'redux'
import { ThunkAction } from 'redux-thunk'

// API
export const api = axios.create({
  baseURL: 'https://www.reddit.com/r',
})

type Child = {
  kind: string
  data: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type State = {
  isLoading: boolean
  children?: Child[]
}

export type SubRedditModel = {
  data: Child[]
}

export const getSubreddit = (subreddit: string) =>
  api.get<SubRedditModel>(`/${subreddit}.json`)

export const initialState = {
  isLoading: false,
}

const getPosts = (children?: Child[]) => {
  return children
    ? children.map(({ data }) => ({
        title: data.title,
        thumbnail: data.thumbnail,
        selftext: data.selftext,
        permalink: data.permalink,
      }))
    : []
}

export const queries = { getPosts }

const subredditSlice = createSlice({
  name: 'subreddit',
  initialState,
  reducers: {
    started(draft) {
      return {
        ...draft,
        isLoading: true,
      }
    },
    resolved(draft, { payload: { data } }: PayloadAction<SubRedditModel>) {
      return {
        ...draft,
        ...data,
        isLoading: false,
      }
    },
    rejected(draft) {
      return {
        ...draft,
        isLoading: false,
      }
    },
  },
})

const { started, resolved, rejected } = subredditSlice.actions

export const fetchSubreddit: ActionCreator<
  ThunkAction<Promise<SubRedditModel>, { subreddit: State }, null, AnyAction>
> = (subreddit: string) => {
  return async (dispatch) => {
    dispatch(started())

    try {
      const { data } = await getSubreddit(subreddit)
      dispatch(resolved(data))
      return data
    } catch (errors) {
      dispatch(rejected())
      throw errors
    }
  }
}

export default subredditSlice.reducer
