;(function() {
  document.getElementById('execute').addEventListener('click', function() {
    window.invisibleGrecaptcha
      .execute('6LdLnkMUAAAAAA0e7x8KEw9n7W8MMGpwCMszFBwm')
      .then(console.log)
      .catch(console.error)
  })
})()
