/**
 *  @fileOverview Accordion module, initalises accordion instances
 *
 *  @author       Chris Hill
 *
 */

export default class AccordionModule {
  /**
   * @description Initialises accordion instances.
   *
   * @param {Element | null} [target=null] - The element to target for dynamic content
   *
   * @returns {void}
   */
  public init (target: Element | null = null): void {
    let nodes = document.querySelectorAll('.accordion')

    if (target !== null) {
      nodes = target.querySelectorAll('.accordion')
    }

    nodes.forEach((element: HTMLElement, index: number) => {
      let strict: boolean

      /**
       * Check for strict accordion interpretation
       */
      if (typeof element.dataset.strict !== 'undefined') {
        strict = element.dataset.strict === 'true'
      }

      /**
       * Apply event listeners to all accordion instance buttons
       */
      const btns = element.querySelectorAll('.accordion-title')
      btns.forEach((btn: HTMLElement, i: number) => {
        btn.addEventListener('click', function () {
          /**
           * Get the next element after the button and toggle class and aria
           */
          const text = btn.nextElementSibling as HTMLElement
          const aria = btn.getAttribute('aria-expanded')

          if (strict) {
            const isopen = btn.classList.contains('accordion-title-open')
            closeAll(element)

            /**
             * Only open if not already opened eg close on click
             */
            if (!isopen) {
              text.classList.toggle('accordion-body-open')
              btn.classList.toggle('accordion-title-open')
              btn.setAttribute(
                'aria-expanded',
                aria === 'true' ? 'false' : 'true'
              )
            }
          } else {
            text.classList.toggle('accordion-body-open')
            btn.classList.toggle('accordion-title-open')
            btn.setAttribute(
              'aria-expanded',
              aria === 'true' ? 'false' : 'true'
            )
          }
        })
      })
    })

    /**
     * @description Closes all accordion body elements
     *
     * @param {Element} accordion - Instance to apply to.
     *
     * @returns {void}
     */
    function closeAll (accordion: Element): void {
      const items = accordion.querySelectorAll('.accordion-item')

      /**
       * Loop through accordion items and close them all
       */
      items.forEach((item) => {
        const btn = item.querySelector('.accordion-title') as HTMLElement
        const body = item.querySelector('.accordion-body') as HTMLElement

        btn.classList.remove('accordion-title-open')
        body.classList.remove('accordion-body-open')
      })
    }
  }
}
