import '@ecu-dmt/ecu-component-library'
import '../css/global.css'

import _config from '../../_config.js'
import AccordionModule from './modules/AccordionModule'
import { initForm } from './modules/FelteFormsModule.js'

_config.log('main is running')

document.addEventListener('DOMContentLoaded', () => {
  _config.log('DOMContentLoaded')
  const accordionModule = new AccordionModule()
  accordionModule.init()

  const form = document.querySelector('felte-form')

  if (form != null) {
    initForm(form)
  }
})
