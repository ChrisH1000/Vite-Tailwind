import '../css/global.css'

import { html } from 'lit'

export const Button = ({
  darkBackground,
  background,
  border,
  label,
  icon,
  link
}) => {
  const colorScheme = darkBackground
    ? 'text-white antialiased'
    : ''

  const borders = border
    ? 'px-5 py-3 border-2 border-current'
    : 'px-3 py-1'

  return html`
    <a
      class=${[
    'w-max text-center no-underline',
    `bg-${background}`,
    colorScheme,
    borders
  ].join(' ')}
  href="${link}"
    >
      ${label}
    </a>
  `
}
