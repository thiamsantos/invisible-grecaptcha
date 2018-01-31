import {
  loadScript,
  isRequired,
  isString,
  isFunction,
  buildParamError
} from './utils'

function render({container, siteKey, callback, position}) {
  const recaptchaId = window.grecaptcha.render(container, {
    siteKey,
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
  siteKey = isRequired('siteKey'),
  callback = isRequired('callback'),
  locale = false,
  position = 'bottomright',
  container = createContainer()
}) {
  return new Promise((resolve, reject) => {
    if (!isString(siteKey)) {
      reject(buildParamError('siteKey', 'string'))
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
        resolve(render({container, siteKey, callback, position}))
      })
    }

    resolve(render({container, siteKey, callback, position}))
  })
}

export function execute({recaptchaId}) {
  window.grecaptcha.execute(recaptchaId)
}

export function reset({recaptchaId}) {
  window.grecaptcha.reset(recaptchaId)
}
export function getResponse({recaptchaId}) {
  return window.grecaptcha.getResponse(recaptchaId)
}
