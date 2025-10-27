import { Section } from './Section'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Example/Section',
  tags: ['autodocs'],
  render: (args) => Section(args),
  argTypes: {
    background: {
      control: { type: 'select' },
      options: ['white', 'ecru', 'black-50', 'black-100', 'black-200', 'black-600', 'black-700', 'black-800', 'black-900', 'teal-300', 'teal-400', 'teal-500']
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg']
    }
  }
}

export const White = {
  args: {
    background: 'white',
    darkBackground: false
  }
}

export const Ecru = {
  args: {
    background: 'ecru',
    darkBackground: false
  }
}

export const black050 = {
  args: {
    background: 'black-50',
    darkBackground: false
  }
}

export const black100 = {
  args: {
    background: 'black-100',
    darkBackground: false
  }
}

export const black200 = {
  args: {
    background: 'black-200',
    darkBackground: false
  }
}

export const black600 = {
  args: {
    background: 'black-600',
    darkBackground: true
  }
}

export const black700 = {
  args: {
    background: 'black-700',
    darkBackground: true
  }
}

export const black800 = {
  args: {
    background: 'black-800',
    darkBackground: true
  }
}

export const black900 = {
  args: {
    background: 'black',
    darkBackground: true
  }
}

export const teal300 = {
  args: {
    background: 'teal-300',
    darkBackground: false
  }
}

export const teal400 = {
  args: {
    background: 'teal-400',
    darkBackground: false
  }
}

export const teal500 = {
  args: {
    background: 'teal',
    darkBackground: false
  }
}
