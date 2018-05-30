import {
  loadScript,
  validateRequired,
  isString,
  buildParamError,
  render,
  destroyContainer
} from './utils'

/**
 * Creates an invisible reCAPTCHA instance, dynamically loading Google's library if necessary, and then returns a user
 * response token. This is a client-side step, and the token must be sent to the server side for verification as a
 * separate step. Tokens are single use and can be verified only once.
 * @param {string} sitekey - Your recaptcha sitekey. You can get one here: https://www.google.com/recaptcha/admin.
 * @param {Object} [options] - The options to create an invisible reCAPTCHA.
 * @param {string} [options.locale = en] - Language of the captcha. See available language codes https://developers.google.com/recaptcha/docs/language. Auto-detects the user's language if unspecified.
 * @param {string} [options.position = bottomright] - Position the reCAPTCHA badge. Values: bottomright, bottomleft and inline.
 * @returns {string}
 */
export function execute(
  sitekey,
  {locale = 'en', position = 'bottomright'} = {}
) {
  return new Promise((resolve, reject) => {
    validateRequired(sitekey, 'sitekey')

    if (!isString(sitekey)) {
      reject(buildParamError('sitekey', 'string'))
    }

    if (!isString(position)) {
      reject(buildParamError('position', 'string'))
    }

    if (!isString(locale)) {
      reject(buildParamError('locale', 'string'))
    }

    loadScript(locale)
      .then(() => {
        render({sitekey, position, resolve, reject})
      })
      .catch(reject)
  })
}

/**
 * Destroy the instance of an invisible grecaptcha.
 */
export const destroy = destroyContainer
