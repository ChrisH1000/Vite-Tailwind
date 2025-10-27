/**
 * @description Creates a message in the filterlist
 *
 * @param {Object} form - Node element to insert message into.
 *
 * @example
 * //
 * @returns {Bool} NULL.
 */

import '@felte/reporter-element/felte-validation-message'
import '@felte/element/felte-form'

import { reporter } from '@felte/reporter-element'
import { validator } from '@felte/validator-yup'
import { html, render } from 'lit-html'
import * as yup from 'yup'

import _config from '../../../_config.js'

/**
 * Initializes a form with validation messages and a Yup schema.
 *
 * @param {HTMLElement} theForm - The form element to initialize.
 * @returns {void}
 */
const initForm = (theForm) => {
  render(
    validationMessageTemplate(),
    document.querySelector('felte-validation-message')
  )

  let doSecond = false

  const schema = yup.object().shape({
    name: yup.string().required('Must have a name'),
    password: yup.string().required('Must have a password'),
    second: yup.lazy((value) => {
      _config.log(value)
      if (value !== undefined) {
        return yup.string().required('Must have a second')
      }
      return yup.mixed().notRequired()
    })
  })

  const felteForm = theForm
  felteForm.configuration = {
    onSubmit: (values) => {
      const submittedSection = document.getElementById('submitted')
      submittedSection.innerHTML = `
        <h2 class="text-xl font-bold">Submitted:</h2>
        <pre>${JSON.stringify(values, null, 2)}</pre>
      `
    },
    extend: [validator({ schema }), reporter]
  }

  // We remove the submitted value on reset
  const form = document.querySelector('form')
  const submitted = document.getElementById('submitted')
  form.addEventListener('reset', function () {
    submitted.innerHTML = ''
  })

  // Render the template to the document
  setTimeout(() => {
    render(nameTemplate('name', doSecond), theForm.querySelector('#holder'))
  }, '1000')

  document.querySelector('#second').onclick = (e) => {
    doSecond = !doSecond

    render(nameTemplate('name', doSecond), theForm.querySelector('#holder'))
  }

  felteForm.onDataChange = () => {
    // Reacting to changes on `data` using a function.
    _config.log('Form data = ', felteForm.data)
  }

  felteForm.onErrorsChange = () => {
    // Reacting to changes on `errors` using a function.
    // _config.log('Form errors = ', felteForm.errors)
    const errors = []
    Object.entries(felteForm.errors).forEach(([key, value]) => {
      // _config.log(value)
      if (value) {
        errors.push(value)
      }
    })

    _config.log(errors.flat())

    if (errors.length > 0) {
      render(errorsTemplate(errors), theForm.querySelector('.errors'))
    } else {
      render('', theForm.querySelector('.errors'))
    }
  }

  felteForm.onIsDirtyChange = () => {
    // Reacting to changes on `isDirty` using a function.
    _config.log(felteForm.isDirty)
  }
}

/**
 * Returns a lit-html template for a validation message.
 *
 * @return {TemplateResult} The lit-html template for a validation message.
 */
const validationMessageTemplate = () => {
  // The template for the validation message. It includes an unordered list
  // with a list item that has a data attribute for the part of the message.
  // The aria-live attribute is set to "polite" to indicate that the message
  // should be read when it is updated.
  return html`
    <template>
      <ul aria-live="polite">
        <li data-part="item"></li>
      </ul>
    </template>
  `
}

/**
 * Returns a lit-html template for an input field with a required attribute and a validation message.
 *
 * @param {string} name - The name attribute for the input field.
 * @return {TemplateResult} The lit-html template for an input field with a required attribute and a validation message.
 */
const nameTemplate = (name, doSecond) => {
  // The template for an input field with a required attribute and a validation message.
  // The name attribute is set to the provided name parameter.
  // The felte-validation-message element displays validation messages for the input field.
  // The aria-live attribute is set to "polite" to indicate that the message
  // should be read when it is updated.

  const getSecond = () => {
    if (doSecond) {
      return html`
        <label class="block text-gray-700 text-sm font-bold mb-2" for="second">Second</label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="second" required />
        <felte-validation-message for="second">
          ${validationMessageTemplate()}
          <!-- The template for the validation message -->
        </felte-validation-message>
      `
    } else {
      return ''
    }
  }

  return html`
    <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Name</label>
    <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="${name}" required />
    <felte-validation-message for="${name}">
      ${validationMessageTemplate()}
      <!-- The template for the validation message -->
    </felte-validation-message>
    ${getSecond()}
  `
}

/**
 * Returns a lit-html template for a list of errors.
 *
 * @param {Array} errors - An array of DOM elements representing the errors.
 * @return {TemplateResult} The lit-html template for a list of errors.
 */
const errorsTemplate = (errors) => {
  // Initialize an array to hold the lit-html templates for the errors.
  const errorTemplates = []

  // Iterate over each error and add a lit-html template for it to the array.
  errors.forEach((error) => {
    // Log the error to the _config.
    _config.log(error)

    // Add a lit-html template for the error to the array.
    errorTemplates.push(html`<p>${error}</p>`)
  })

  // Return a lit-html template for the list of errors.
  return html`
    <h2 class="text-xl font-bold">Errors</h2>

    <!-- Render the lit-html templates for the errors. -->
    ${errorTemplates}
  `
}

export { initForm }
