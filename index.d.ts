declare module 'invisible-grecaptcha' {
  export = invisibleGrecaptcha
}

declare namespace invisibleGrecaptcha {
  interface Options {
    locale?: string
    position?: string
  }

  function execute(sitekey: string, options: Options): string
  function destroy()
}
