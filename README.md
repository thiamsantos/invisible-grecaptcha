# invisible-grecaptcha
Invisible reCAPTCHA integration

## Usage

```js
import {
  createInvisibleRecaptcha, 
  execute, 
  reset, 
  getResponse,
} from 'invisible-grecaptcha'

function verifyCallback(response) {
  console.log(response)
}

const grecaptcha = await createInvisibleRecaptcha({
  siteKey: 'RECAPTCHA_SITE_KEY',
  callback: verifyCallback,
  locale: 'pt',
  position: 'bottomright'
})

execute(grecaptcha)
reset(grecaptcha)
getResponse(grecaptcha)
```
