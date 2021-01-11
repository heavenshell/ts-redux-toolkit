import * as React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

import Home from './containers/Home'
import Subreddit from './containers/Subreddit'

const Routes = () => (
  <HashRouter>
    <Switch>
      <Route component={Home} path="/" exact />
      <Route component={Subreddit} path="/subreddit" exact />
    </Switch>
  </HashRouter>
)

export default Routes
