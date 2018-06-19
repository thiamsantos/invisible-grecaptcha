const url = require('url')

const testKeys = require('recaptcha-test-keys')
const Grecaptcha = require('grecaptcha')

const {api, browser, server} = require('./test-helpers')

describe('invisible-grecaptcha', () => {
  beforeAll(() => Promise.all([server.start(), browser.start()]))
  afterAll(() => Promise.all([server.stop(), browser.stop()]))

  describe('after starting the server and browser', () => {
    it('the test harness page loads successfully', async () => {
      const testHarnessUrl = new url.URL('test/test.html', server.baseUrl)
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
