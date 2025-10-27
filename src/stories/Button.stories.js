import '@ecu-dmt/ecu-component-library'

import { html } from 'lit'
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'

// This default export determines where your story goes in the story list
export default {
  title: 'Example/Button',
  tags: ['autodocs'],
  component: 'ecu-button',
  argTypes: {
    btnStyle: {
      control: { type: 'select' },
      options: ['primary-conversion', 'secondary-conversion', 'primary-standard', 'form-submit', 'default']
    }
  },
  render: ({
    btnTitle,
    btnUrl,
    btnStyle,
    btnIcon
  }) => html`
    <ecu-button .title=${btnTitle} .url=${btnUrl} .btnStyle=${btnStyle}>
      ${unsafeHTML(btnIcon)}
    </ecu-button>
  `
}

export const PrimaryConversionButtonIcon = {
  name: 'Primary (conversion) button with URL and icon',
  args: {
    btnTitle: 'Primary (conversion) button with URL and icon',
    btnUrl: 'https://ecu.edu.au',
    btnStyle: 'primary-conversion',
    btnIcon: '<i slot="start" class="fa-sharp fa-solid fa-arrow-left mr-2"></i>'
  }
}

export const SecondayConversionButton = {
  name: 'Seconday (conversion) button (no URL, no icon)',
  args: {
    btnTitle: 'Secondary (conversion) button',
    btnUrl: 'https://ecu.edu.au',
    btnStyle: 'secondary-conversion'
  }
}

export const PrimaryStandardButtonIcon = {
  name: 'Primary (standard) button with URL and icon',
  args: {
    btnTitle: 'Primary (standard) button with URL and icon',
    btnUrl: 'https://ecu.edu.au',
    btnStyle: 'primary-standard',
    btnIcon: '<i slot="end" class="fa-sharp fa-solid fa-arrow-right ml-2"></i>'
  }
}

export const SecondaryStandardButtonIcon = {
  name: 'Secondary (standard) button (no URL, no icon)',
  args: {
    btnTitle: 'Secondary (standard) button',
    btnStyle: 'default'
  }
}

export const TextOnlyButton = {
  name: 'Text only submit button (no URL, no icon)',
  args: {
    btnTitle: 'Text only button',
    btnStyle: 'text-only'
  }
}

export const FormSubmitButton = {
  name: 'Form submit button (no URL, no icon)',
  args: {
    btnTitle: 'Form submit button',
    btnStyle: 'form-submit'
  }
}
