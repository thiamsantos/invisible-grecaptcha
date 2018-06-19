const http = require('http')
const path = require('path')
const url = require('url')

const puppeteer = require('puppeteer')
const serveHandler = require('serve-handler')

// Encapsulate the asynchronous starting and stopping of a simple HTTP server at http://localhost:3000. This is needed
// because reCAPTCHAs don't work from within pages loaded directly from the file system.
const server = {
  _instance: null,
  _port: 5000,

  get baseUrl() {
    return url.format({
      protocol: 'http',
      hostname: 'localhost',
      port: this._port
    })
  },

  start() {
    this._instance = http.createServer(serveHandler)
    return new Promise(resolve => this._instance.listen(this._port, resolve))
  },

  stop() {
    return new Promise(resolve => this._instance.close(resolve))
  }
}

// Encapsulate the asynchronous starting and stopping of a Chromium browser using puppeteer.
const browser = {
  // Setting _debug to `true` does three things that aid in troubleshooting by:
  // 1. running Chromium with a GUI (i.e. not in headless mode),
  // 2. recording a trace file that can be dropped into devtools for analysis, and
  // 3. leaving Chromium up and running after tests complete for manual interaction.
  _debug: false,
  _instance: null,

  page: null,

  async start() {
    this._instance = await puppeteer.launch({
      // Running Chromium under Travis CI requires disabling the sandbox. See <https://bit.ly/2t8TdJO>.
      args: process.env.TRAVIS ? ['--no-sandbox'] : [],
      headless: !this._debug
    })
    this.page = await this._instance.newPage()

    if (this._debug) {
      const traceFilePath = path.join(__dirname, 'trace.json')
      await this.page.tracing.start({path: traceFilePath, screenshots: true})
    }
  },

  async stop() {
    if (this._debug) {
      await this.page.tracing.stop()
    }
    if (!this._debug) {
      await this._instance.close()
    }
  }
}

// Encapsulate all the library strings and their compositions for consistency.
const api = {
  qualify(fn) {
    return `window.${this.library}` + (fn ? `.${fn}()` : '')
  },

  library: 'invisibleGrecaptcha',

  get libraryQualified() {
    return this.qualify()
  },

  executeFn: 'execute',

  get executeFnQualified() {
    return this.qualify(this.executeFn)
  },

  destroyFn: 'destroy',

  get destroyFnQualified() {
    return this.qualify(this.destroyFn)
  },

  containerId: 'invisible-recaptcha'
}

module.exports = {
  api,
  browser,
  server
}
