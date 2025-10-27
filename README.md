## Build Setup

Please configure your [Local development environment](https://ecu.atlassian.net/wiki/spaces/DSEP/pages/166069315) before cloninng and setting up this build repo.

## Run commands

``` bash
# open and watch local server
pnpm dev

# build for development with user definable output path (for direct install on webserver)
pnpm build:dev

# build for production with minification into user definable output path
pnpm build

# build for production with minification into user definable output path generate stats for build
pnpm build:stats

# Run linting check across JS files
pnpm lint

# Automate linting fixes across JS files
pnpm lint:fix

# Run linting of SCSS files
pnpm stylelint

# Run Tests across all browsers with Playwright
pnpm test

# Run Tests across Chrome with Playwright
pnpm test:chrome

# Run Tests across Firefox with Playwright
pnpm test:firefox

# Run Tests across Safari with Playwright
pnpm test:safari

# Run Storybook
pnpm storybook
```
