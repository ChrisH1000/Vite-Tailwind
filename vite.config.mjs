import { visualizer } from 'rollup-plugin-visualizer'
import removeConsole from 'vite-plugin-remove-console'
import stylelintPlugin from 'vite-plugin-stylelint'

import _config from './_config.js'

const HOST = _config.server.host
const PORT = _config.server.port

/**
 * Vite's assetFileNames hook.
 *
 * - If the asset name ends with .css, and is red.css or blue.css, return the
 *   appropriate path in the red or blue directories.
 * - Otherwise, return the asset name.
 * - If the asset name does not end with .css, return assets/[name][extname].
 */
const assetFileNames = (assetInfo) => {
  if (assetInfo.name.endsWith('.css')) {
    if (assetInfo.name === 'red.css') {
      return 'red/main.css'
    } else if (assetInfo.name === 'blue.css') {
      return 'blue/main.css'
    }
    return assetInfo.name
  }
  return 'assets/[name][extname]'
}

// Default Production Config
let plugins = [
  removeConsole(),
  stylelintPlugin(),
  visualizer({
    open: process.env.NODE_ENV === 'stats',
    // template: 'sunburst',
    gzipSize: true,
    filename: 'stats.html'
  })
]
let outDir = 'dist'
let minify = true
let output = {
  entryFileNames: '[name].js',
  chunkFileNames: '[name]-[hash].js',
  assetFileNames,
  manualChunks (id) {
    if (id.includes('ecu-component-library')) {
      return 'ecu-component-library'
    }
    if (id.includes('node_modules')) {
      return 'vendor'
    }
  }
}

// Override for development
if (process.env.NODE_ENV === 'development') {
  plugins = [stylelintPlugin()]
  outDir = 'dev'
  minify = false
  output = {
    entryFileNames: '[name].js',
    chunkFileNames: '[name]-[hash].js',
    assetFileNames
  }
}

export default {
  server: {
    host: HOST,
    port: PORT,
    open: true
  },
  build: {
    copyPublicDir: false,
    outDir,
    minify,
    rollupOptions: {
      input: {
        'blue/blue': 'src/js/main.ts',
        'red/red': 'src/js/main-red.ts'
      },
      output
    },
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    emptyOutDir: true
  },
  plugins
}
