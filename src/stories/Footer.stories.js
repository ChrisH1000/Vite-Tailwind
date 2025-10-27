import { Footer } from './Footer'

export default {
  title: 'Example/Footer',
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/web-components/vue/writing-docs/autodocs
  tags: ['autodocs'],
  render: (args) => Footer(args)
}
export const chatOpen = {
  args: {
    message: 'Chat with an expert'
  }
}

export const chatClosed = {
  args: {
    message: 'We are closed'
  }
}
