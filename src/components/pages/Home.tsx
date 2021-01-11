import * as React from 'react'

type ViewProps = {
  // Add view props here
}

type UserEvent =
  | React.MouseEvent<HTMLAnchorElement>
  | React.KeyboardEvent<HTMLAnchorElement>

type ActionProps = {
  onSubredditLinkClick: (e: UserEvent) => void
}

type Props = ViewProps & ActionProps

const Home: React.FC<Props> = ({ onSubredditLinkClick }) => (
  <div>
    <p>
      <a
        role="link"
        onClick={onSubredditLinkClick}
        onKeyDown={onSubredditLinkClick}
        tabIndex={0}
      >
        Subreddit(use hooks)
      </a>
    </p>
  </div>
)

export default Home
