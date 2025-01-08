import Translator from './Translator.js'

class Api {
  static send (action, data, callback) {
    const xhr = new XMLHttpRequest() // eslint-disable-line no-undef

    xhr.open('POST', '/api.php', (typeof callback === 'function'))
    xhr.setRequestHeader('Content-Type', 'application/json')

    if (typeof data !== 'object') {
      data = {}
    }

    data.action = action

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) { // eslint-disable-line no-undef
        if (xhr.status === 200 || xhr.status === 400 || xhr.status === 401) {
          if (typeof callback === 'function') {
            callback(JSON.parse(xhr.responseText))
          }
        } else {
          console.error('Erreur XHR:', xhr.status, xhr.responseText)
          alert(Translator.__('Api:Request:error')) // eslint-disable-line no-undef
        }
      }
    }

    xhr.send(JSON.stringify(data))

    return this
  }
}

export default Api
