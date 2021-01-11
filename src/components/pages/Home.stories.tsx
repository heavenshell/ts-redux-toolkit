import * as React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import Home from './Home'

storiesOf('pages/Home', module).add('default', () => (
  <Home
    onSubredditLinkClick={(
      e:
        | React.MouseEvent<HTMLAnchorElement>
        | React.KeyboardEvent<HTMLAnchorElement>
    ) => {
      e.preventDefault()
      action('onSubredditLinkClick')(e.target)
    }}
  />
))
