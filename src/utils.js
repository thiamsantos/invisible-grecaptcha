const CALLBACK_NAME = '_grecaptchaonloadcallback'

export function loadScript(locale) {
  return new Promise((resolve, reject) => {
    const url = `https://www.google.com/recaptcha/api.js?onload=${encodeURIComponent(
      CALLBACK_NAME
    )}${locale === false ? '' : `&hl=${encodeURIComponent(locale)}`}`

    window[CALLBACK_NAME] = resolve

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.onerror = err => {
      reject(new URIError(`The script ${err.target.src} is not accessible.`))
    }

    document.head.appendChild(script)
  })
}

export function validateRequired(arg, name) {
  if (arg === null || arg === undefined) {
    throw new TypeError(`param ${name} is required`)
  }
}

export function isString(val) {
  return typeof val === 'string' || val instanceof String
}

export function isNumber(val) {
  return typeof val === 'number' || val instanceof Number
}

export function buildParamError(param, expectedType) {
  return new TypeError(
    `param ${param} has an unexpected type, a ${expectedType} is expected.`
  )
}

export function render({sitekey, position, resolve, reject}) {
  const recaptchaId = window.grecaptcha.render(createContainer(), {
    sitekey,
    size: 'invisible',
    badge: position,
    callback: resolve,
    'error-callback': reject
  })

  window.grecaptcha.execute(recaptchaId)
}

export function destroyContainer() {
  const el = document.getElementById('invisible-captcha')
  if (el) {
    el.parentNode.removeChild(el)
  }
}

export function createContainer() {
  destroyContainer()

  const container = document.createElement('div')
  container.id = 'invisible-captcha'
  document.body.appendChild(container)
  return container
}
