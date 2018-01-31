declare module 'invisible-grecaptcha' {
  export = invisibleGrecaptcha
}

declare namespace invisibleGrecaptcha {
  type GrecaptchaId = number

  interface Options {
    sitekey: string
    callback: (token: string) => void
    locale?: string
    position?: string
    container?: HTMLElement
  }

  function createInvisibleRecaptcha(options: Options): GrecaptchaId
  function execute(grecaptchaId: GrecaptchaId)
  function reset(grecaptchaId: GrecaptchaId)
  function getResponse(grecaptchaId: GrecaptchaId): string
}
