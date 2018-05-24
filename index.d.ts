declare module 'invisible-grecaptcha' {
  export = invisibleGrecaptcha
}

declare namespace invisibleGrecaptcha {
  interface Options {
    locale?: string
    position?: 'bottomright' | 'bottomleft' | 'inline'
  }

  function execute(sitekey: string, options?: Options): string
  function destroy(): void
}
