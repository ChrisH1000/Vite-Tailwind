import '../css/global.css'

import { html } from 'lit'

export const Section = ({
  darkBackground,
  background,
  size
}) => {
  const mode = darkBackground
    ? 'text-white antialiased'
    : 'text-black'

  return html`
    <section
      class=${[
    'relative px-4 py-4 md:px-12 md:py-12 lg:px-20 lg:py-24',
    `bg-${background}`,
    mode
  ].join(' ')}
    >

      <div 
        class=${[
    'mx-auto stack',
    `max-w-screen-${size || 'md'}`
  ].join(' ')}
      >

        <h2 class="text-xl font-bold">Section heading</h2>
        
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Donec ac odio tempor orci. Neque volutpat ac tincidunt vitae semper quis lectus nulla at. Ac turpis egestas maecenas pharetra convallis. Amet risus nullam eget felis eget nunc lobortis mattis. Senectus et netus et malesuada. Tristique sollicitudin nibh sit amet commodo nulla. Urna nunc id cursus metus aliquam eleifend mi. Vitae tortor condimentum lacinia quis vel eros. Sed enim ut sem viverra. Convallis posuere morbi leo urna molestie at elementum.</p>

        <p>Nunc sed id semper risus in hendrerit. Convallis aenean et tortor at risus viverra. Proin libero nunc consequat interdum varius sit amet mattis. Feugiat scelerisque varius morbi enim nunc faucibus. Aliquet sagittis id consectetur purus ut faucibus pulvinar. Dapibus ultrices in iaculis nunc sed augue lacus viverra. Ultrices neque ornare aenean euismod elementum nisi quis. Donec enim diam vulputate ut. Aliquet nibh praesent tristique magna sit amet. Aliquam vestibulum morbi blandit cursus risus at ultrices mi tempus. Placerat vestibulum lectus mauris ultrices eros in cursus turpis. Aliquet nibh praesent tristique magna sit amet purus. Tempus iaculis urna id volutpat lacus. Fringilla ut morbi tincidunt augue. Sed euismod nisi porta lorem mollis aliquam ut. At consectetur lorem donec massa sapien faucibus et. Augue lacus viverra vitae congue eu consequat ac felis.</p>

      </div>

    </section>
  `
}
