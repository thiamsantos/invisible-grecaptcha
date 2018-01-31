declare module 'invisible-grecaptcha' {
  export = invisibleGrecaptcha
}

declare namespace invisibleGrecaptcha {
  interface Grecaptcha {
    recaptchaId: number
    container: HTMLElement
  }

  interface Options {
    sitekey: string
    callback: Function
    locale?: string
    position?: string
    container?: HTMLElement
  }

  function createInvisibleRecaptcha(options: Options): Grecaptcha
  function execute(grecaptcha: Grecaptcha)
  function reset(grecaptcha: Grecaptcha)
  function getResponse(grecaptcha: Grecaptcha): string
}
