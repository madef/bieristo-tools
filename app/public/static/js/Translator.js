'use strict'

import CannotLoadLanguage from './Exception/CannotLoadLanguage.js'
import MissingTranslation from './Exception/MissingTranslation.js'

class Translator {
  constructor (language) {
    this.translations = {}
  }

  static getInstance () {
    if (typeof Translator.instance === 'undefined') {
      Translator.instance = new Translator()
    }

    return Translator.instance
  }

  static __ (str, params, count) {
    return Translator.getInstance().get(str, params, count)
  }

  load (callback, defaultLanguage = 'fr_FR') {
    const languageStored = localStorage.getItem('language') // eslint-disable-line no-undef
    this.language = languageStored || defaultLanguage

    return fetch(`/static/languages/${this.language}.json`, { method: 'GET' })
      .then(response => {
        if (!response.ok) {
          throw new CannotLoadLanguage(`Cannot load ${this.language} language file.`)
        }
        return response.json()
      }).then(json => {
        this.translations = json
        callback()
      })
  }

  get (str, params, countStr = '*') {
    let strTranslated

    if (typeof this.translations[str] === 'undefined') {
      throw new MissingTranslation(`Missing translation for ${str}`)
    }

    if (typeof this.translations[str][countStr] === 'undefined') {
      throw new MissingTranslation(`Missing translation for ${str}`)
    }

    strTranslated = this.translations[str][countStr]

    if (typeof params === 'object') {
      const keys = Object.keys(params)
      for (const i in keys) {
        const param = keys[i]
        strTranslated = strTranslated.replaceAll(`%${param}%`, params[param])
      }
    }

    return strTranslated
  }
}

export default Translator
