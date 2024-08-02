'use strict'

import Translator from './Translator.js'
import Layout from './Layout.js'
import LayoutBleuScreenOfDeath from './LayoutBleuScreenOfDeath.js'

class App {
  constructor () {
    const $root = document.getElementById('app')

    Translator.getInstance()
      .load(() => {
        this.layout = new Layout(
          $root
        )
        document.title = Translator.__('AppTitle')
      })
      .catch((e) => {
        new LayoutBleuScreenOfDeath($root, e.message) // eslint-disable-line no-new
        console.error(e)
      })
  }
}

new App() // eslint-disable-line no-new
