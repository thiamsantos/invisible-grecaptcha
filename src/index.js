import {
  loadScript,
  isRequired,
  isString,
  isFunction,
  validateRecaptchaId,
  buildParamError
} from './utils'

function render({container, sitekey, callback, position}) {
  const recaptchaId = window.grecaptcha.render(container, {
    sitekey,
    callback,
    size: 'invisible',
    badge: position
  })

  return {recaptchaId, container}
}

function createContainer() {
  const container = document.createElement('div')
  document.body.appendChild(container)
  return container
}

export function createInvisibleGrecaptcha({
  sitekey = isRequired('sitekey'),
  callback = isRequired('callback'),
  locale = null,
  position = 'bottomright',
  container = createContainer()
}) {
  return new Promise((resolve, reject) => {
    if (!isString(sitekey)) {
      reject(buildParamError('sitekey', 'string'))
    }

    if (!isString(position)) {
      reject(buildParamError('position', 'string'))
    }

    if (locale !== false && !isString(locale)) {
      reject(buildParamError('locale', 'string'))
    }

    if (!isFunction(callback)) {
      reject(buildParamError('callback', 'function'))
    }

    if (!window.grecaptcha) {
      const url = `https://www.google.com/recaptcha/api.js${
        locale === false ? '' : `?hl=${encodeURIComponent(locale)}`
      }`

      loadScript(url).then(() => {
        resolve(render({container, sitekey, callback, position}))
      })
    }

    resolve(render({container, sitekey, callback, position}))
  })
}

export function execute({recaptchaId = isRequired('recaptchaId')}) {
  validateRecaptchaId(recaptchaId)
  window.grecaptcha.execute(recaptchaId)
}

export function reset({recaptchaId = isRequired('recaptchaId')}) {
  validateRecaptchaId(recaptchaId)
  window.grecaptcha.reset(recaptchaId)
}
export function getResponse({recaptchaId = isRequired('recaptchaId')}) {
  validateRecaptchaId(recaptchaId)
  return window.grecaptcha.getResponse(recaptchaId)
}
