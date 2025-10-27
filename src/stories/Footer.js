import '../css/global.css'

import { html } from 'lit'

export const Footer = ({
  message
}) => {
  return html`
      <div class="mx-auto max-w-screen-lg grid gap-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 text-dark dark:text-white dark:antialiased">

        <div class="stack md:col-span-2 lg:col-span-3">
          <h3 class="text-xl font-bold">Ways to contact us</h3>

          <h4 class="text-lg font-bold"><i class="fa-sharp fa-solid fa-fw fa-clock mr-2"></i>Opening times</h4>

          <p class="text-xl font-bold">Monday-Friday 8:30am-5:00pm</p>
          <p>It's now 3:54pm in Perth</p>

        </div>

        <div class="stack">
          <h3 class="text-xl font-bold">Our socials</h3>
          <div class="inline-flex gap-x-5">
            <a href="#"><i class="fab fa-facebook fa-2x"></i></a>
            <a href="#"><i class="fab fa-instagram fa-2x"></i></a>
            <a href="#"><i class="fab fa-linkedin fa-2x"></i></a>
            <a href="#"><i class="fab fa-tiktok fa-2x"></i></a>
          </div>
        </div>

        <div class="stack">
          <h3 class="text-xl font-bold">Within Australia</h3>
          <ul class="list-none px-0 stack stack-s" role="list">
            <li><i class="fa-sharp fa-solid fa-fw fa-question mr-2"></i><a href="#">Ask us</a></li>
            <li><i class="fa-sharp fa-solid fa-fw fa-info-circle mr-2"></i><a href="#">Enquiries</a></li>
            <li><i class="fa-sharp fa-solid fa-fw fa-phone mr-2"></i><a href="tel:+61-8-6304-0000" aria-label="Call us on +61 8 6304 0000">+61 8 6304 0000</a></li>
          </ul>
        </div>

        <div class="stack">
          <h3 class="text-xl font-bold">International</h3>
          <ul class="list-none px-0 stack stack-s" role="list">
            <li><i class="fa-sharp fa-solid fa-fw fa-question mr-2"></i><a href="#">Ask us</a></li>
            <li><i class="fa-sharp fa-solid fa-fw fa-info-circle mr-2"></i><a href="#">Enquiries</a></li>
            <li><i class="fa-sharp fa-solid fa-fw fa-phone mr-2"></i><a href="tel:+61-8-6304-0000" aria-label="Call us on +61 8 6304 0000">+61 8 6304 0000</a></li>
            <li><i class="fa-sharp fa-solid fa-fw fa-search mr-2"></i><a href="#">Find an authorised agent</a></li>
          </ul>
        </div>

        <div class="stack">
          <h3 class="text-xl font-bold">Campuses</h3>
          <p>Maps, directions and virtual tours for:</p>
          <ul class="list-none px-0 stack stack-s" role="list">
            <li><a href="#">Joondalup</a></li>
            <li><a href="#">Mount Lawley</a></li>
          </ul>
        </div>

        <div class="stack">
          <ul class="list-none px-0 stack stack-s" role="list">
            <li><a href="#">CRICOS Provider</a></li>
            <li><a href="#">RTO Code 4745</a></li>
          </ul>
        </div>

      </div>

    </section>
    <p class="absoulute bottom-0 w-max ml-auto bg-orange p-2">
      <i class="fa-sharp fa-regular fa-comment mr-2"></i>${message}
    </p>
  `
}
