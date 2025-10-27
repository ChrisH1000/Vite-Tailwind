import '@ecu-dmt/ecu-component-library'

import { html } from 'lit'

// This default export determines where your story goes in the story list
export default {
  title: 'Example/Accordion',
  tags: ['autodocs'],
  component: 'ecu-accordion-element',
  subcomponents: { AccordionItem: 'ecu-accordion-item' },
  render: ({
    doBTN,
    strict,
    open
  }) => html`
    <ecu-accordion-element .showbtn=${doBTN} .strict=${strict} .open=${open}>
      <ecu-accordion-item title="First item">
          <p>First Item</p>
      </ecu-accordion-item>
      <ecu-accordion-item title="Second item">
          <p>Second Item</p>
      </ecu-accordion-item>
    </ecu-accordion-element>
  `
}

export const ShowButton = {
  name: 'Show all button and strict mode off',
  args: {
    doBTN: true,
    strict: false
  }
}

export const Strict = {
  name: 'Show all button off and strict mode on',
  args: {
    doBTN: false,
    strict: true
  }
}
