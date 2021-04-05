import * as React from 'react'
import * as yup from 'yup'
import { FormikHelpers } from 'formik'
import { action } from '@storybook/addon-actions'
import { text } from '@storybook/addon-knobs'
import { Story, Meta } from '@storybook/react/types-6-0'
import { image, internet, lorem } from 'faker'

import Subreddit, { Values, Props } from './Subreddit'

const story: Meta = {
  title: 'pages/Subreddit',
  component: Subreddit,
  argTypes: {},
}

const handleSubmit = (eventName = 'onSubmit', timeout = 2000) => (
  values: Values,
  formikHelpers: FormikHelpers<Values>
) => {
  setTimeout(() => {
    formikHelpers.setSubmitting(false)
    action(eventName)(values)
  }, timeout)
}

const validationSchema = yup.object().shape({
  subreddit: yup.string().required(),
})

const mockData = Array.from(new Array(10), () => ({
  title: lorem.words(),
  thumbnail: image.imageUrl(),
  selftext: lorem.sentences(),
  permalink: internet.url(),
}))

const Template: Story<Props> = (args) => <Subreddit {...args} />

export const component = Template.bind({})
component.args = {
  initialValues: { subreddit: text('subreddit', 'text') },
  isLoading: false,
  onSubmit: handleSubmit(),
  validationSchema,
  posts: mockData,
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    action('onLinkClick')(e.target)
  },
}
component.storyName = 'default'

export const regression = Template.bind({})
regression.args = {
  initialValues: { subreddit: text('subreddit', 'text') },
  isLoading: false,
  onSubmit: handleSubmit(),
  validationSchema,
  posts: mockData,
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    action('onLinkClick')(e.target)
  },
}
regression.storyName = 'regression'

export const isLoading = Template.bind({})
isLoading.args = {
  initialValues: { subreddit: '' },
  isLoading: true,
  onSubmit: handleSubmit(),
  validationSchema,
  posts: [],
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    action('onLinkClick')(e.target)
  },
}
isLoading.storyName = 'isLoading'

export const noData = Template.bind({})
noData.args = {
  initialValues: { subreddit: '' },
  isLoading: false,
  onSubmit: handleSubmit(),
  validationSchema,
  posts: [],
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    action('onLinkClick')(e.target)
  },
}
noData.storyName = 'no data'

export default story
