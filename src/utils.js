const CALLBACK_NAME = '_grecaptcha.onload-callback'

export function loadScript(locale) {
  return new Promise((resolve, reject) => {
    const url = `https://www.google.com/recaptcha/api.js?onload=${CALLBACK_NAME}${
      locale === false ? '' : `&hl=${encodeURIComponent(locale)}`
    }`

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

export function isFunction(val) {
  return typeof val === 'function' || val instanceof Function
}

export function isNumber(val) {
  return typeof val === 'number' || val instanceof Number
}

export function buildParamError(param, expectedType) {
  return new TypeError(
    `param ${param} has an unexpected type, a ${expectedType} is expected.`
  )
}

export function validateRecaptchaId(recaptchaId) {
  validateRequired(recaptchaId, 'recaptchaId')
  if (!isNumber(recaptchaId)) {
    throw buildParamError('recaptchaId', 'number')
  }
}

export function render({container, sitekey, callback, position}) {
  const recaptchaId = window.grecaptcha.render(container, {
    sitekey,
    callback,
    size: 'invisible',
    badge: position
  })

  return recaptchaId
}

export function createContainer() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return container
}
