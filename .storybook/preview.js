/** @type { import('@storybook/web-components').Preview } */

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

const ECU_VIEWPORTS = {
  mobile: {
    name: "ECU Mobile",
    styles: {
      width: "414px",
      height: "1080px",
    },
  },
  tablet: {
    name: "ECU Tablet",
    styles: {
      width: "768px",
      height: "1080px",
    },
  },
  laptop: {
    name: "ECU Laptop",
    styles: {
      width: "1440px",
      height: "1080px",
    },
  },
  uhd: {
    name: "ECU UHD",
    styles: {
      width: "1920px",
      height: "1080px",
    },
  },
}

const preview = {
  globalTypes: {
    darkMode: {
      defaultValue: true, // Enable dark mode by default on all stories
    },
    // Optional (Default: 'dark')
    className: {
      defaultValue: 'dark-mode', // Set your custom dark mode class name
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    viewport: {
      viewports: ECU_VIEWPORTS,
    }
  }
};

export default preview;
