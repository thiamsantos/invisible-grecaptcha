;(function() {
  var executeElement = document.getElementById('execute')
  var resetElement = document.getElementById('reset')
  var getResponseElement = document.getElementById('get-response')

  function verifyCallback(token) {
    console.log(token)
  }

  window.invisibleGrecaptcha
    .createInvisibleGrecaptcha({
      sitekey: '6LdLnkMUAAAAAA0e7x8KEw9n7W8MMGpwCMszFBwm',
      callback: verifyCallback,
      locale: 'en'
    })
    .then(function(grecaptchaId) {
      executeElement.addEventListener('click', function() {
        window.invisibleGrecaptcha.execute(grecaptchaId)
      })

      resetElement.addEventListener('click', function() {
        window.invisibleGrecaptcha.reset(grecaptchaId)
      })

      getResponseElement.addEventListener('click', function() {
        var token = window.invisibleGrecaptcha.getResponse(grecaptchaId)
        console.log(token)
      })
    })
    .catch(console.error)
})()
