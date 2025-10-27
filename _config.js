const _config = {
  server: {
    host: 'localhost',
    port: 3333
  },
  log: function () {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(...arguments)
    }
  }
}

export default _config
