import { _ as _config, i as initForm, A as AccordionModule } from "../FelteFormsModule-CpxpagSq.js";
_config.log("main is running");
document.addEventListener("DOMContentLoaded", () => {
  _config.log("DOMContentLoaded");
  const accordionModule = new AccordionModule();
  accordionModule.init();
  const form = document.querySelector("felte-form");
  if (form != null) {
    initForm(form);
  }
});
