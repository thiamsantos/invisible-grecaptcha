export function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.async = true
    script.defer = true
    script.onload = () => {
      resolve(script)
    }
    script.onerror = err => {
      reject(new URIError(`The script ${err.target.src} is not accessible.`))
    }

    document.head.appendChild(script)
  })
}

export function isRequired(name) {
  throw new TypeError(`param ${name} is required`)
}

export function isString(val) {
  return typeof val === 'string' || val instanceof String
}

export function isFunction(val) {
  return typeof val === 'function' || val instanceof Function
}

export function buildParamError(param, expectedType) {
  return new TypeError(
    `param ${param} has an unexpected type, a ${expectedType} is expected.`
  )
}
