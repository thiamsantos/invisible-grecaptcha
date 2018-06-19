const http = require('http')
const path = require('path')
const url = require('url')
const puppeteer = require('puppeteer')
const serveHandler = require('serve-handler')
const testKeys = require('recaptcha-test-keys')
const Grecaptcha = require('grecaptcha')

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
    this._instance = await puppeteer.launch({headless: !this._debug})
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

describe('invisible-grecaptcha', () => {
  beforeAll(() => Promise.all([server.start(), browser.start()]))
  afterAll(() => Promise.all([server.stop(), browser.stop()]))

  describe('after starting the server and browser', () => {
    it('the test harness page loads successfully', async () => {
      const testHarnessUrl = new url.URL('src/tests/test.html', server.baseUrl)
      const response = await browser.page.goto(testHarnessUrl.href)
      expect(response.ok()).toBe(true)
    })
  })

  describe('after loading the distributable script', () => {
    it(`the library '${api.libraryQualified}' is added`, async () => {
      // Check the base state before loading the script.
      const windowHandle = await browser.page.evaluateHandle(() => window)
      let windowProperties = await windowHandle.getProperties()
      expect(windowProperties.has(api.library)).toBe(false)

      // Load the distributable version of the script. Note that this requires a build to occur beforehand!
      const scriptUrl = new url.URL('dist/index.umd.js', server.baseUrl)
      await browser.page.addScriptTag({url: scriptUrl.href})

      // Check the state after loading the script.
      windowProperties = await windowHandle.getProperties()
      expect(windowProperties.has(api.library)).toBe(true)
    })

    for (const libraryFunction of [api.executeFn, api.destroyFn]) {
      it(`the library function '${api.qualify(
        libraryFunction
      )}' is present`, async () => {
        const libraryHandle = await browser.page.evaluateHandle(
          api => window[api.library],
          api
        )
        const libraryProperties = await libraryHandle.getProperties()
        expect(libraryProperties.has(libraryFunction)).toBe(true)
      })
    }
  })

  describe('when invoking the API', () => {
    let token = null

    beforeAll(async () => {
      token = await browser.page.evaluate(
        (api, sitekey) => window[api.library][api.executeFn](sitekey),
        api,
        testKeys.sitekey
      )
    })

    it(`'${
      api.executeFnQualified
    }' adds a reCAPTCHA div to the page`, async () => {
      const containerHandle = await browser.page.$(api.containerId)
      expect(containerHandle).toBeDefined()
    })

    it(`'${
      api.executeFnQualified
    }' returns a verifiable string token`, async () => {
      expect(token).not.toBe('')
      expect(typeof token).toBe('string')

      const grecaptcha = new Grecaptcha(testKeys.secret)
      expect(await grecaptcha.verify(token)).toBe(true)
    })

    it(`'${
      api.destroyFnQualified
    }' removes the reCAPTCHA div from the page`, async () => {
      await browser.page.evaluate(
        api => window[api.library][api.destroyFn](),
        api
      )
      const containerHandle = await browser.page.$(api.containerId)
      expect(containerHandle).toBeNull()
    })
  })
})
