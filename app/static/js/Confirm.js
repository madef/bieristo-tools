'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'

class Confirm {
  constructor (callback, confirmSentence, options) {
    if (typeof confirmSentence === 'undefined') {
      confirmSentence = Translator.__('Confirm:default')
    }

    const buttonClasses = ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto']
    if (typeof options === 'undefined') {
      options = [
        {
          label: Translator.__('Generic:no'),
          classes: buttonClasses.concat('bg-red-700', 'hover:text-red-700', 'focus:text-red-700'),
          value: 0
        },
        {
          label: Translator.__('Generic:yes'),
          classes: buttonClasses.concat('bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'),
          value: 1
        }
      ]
    }

    const proceed = (e, value) => {
      e.stopPropagation()
      console.log('proceed', value)
      popin.remove()
    }

    const popin = new Brique(`<div class="absolute inset-0 text-white overflow-y-auto p-2 flex flex-col justify-center items-center bg-black/80 backdrop-blur-sm" data-var="overlay">
        <div class="flex flex-col items-center max-w-2xl w-full flex p-4 gap-6" data-var="popin">
          <p class="text-2xl">${confirmSentence}</p>
          <div data-var="actions" class="flex justify-between w-full gap-4 flex-wrap"></div>
        </div>
      </div>`)
      .addEventListener('overlay', 'click', (e) => proceed(e, 0))
      .appendTo(document.body)

    options.forEach(option => {
      const button = new Brique(`<button data-var="action">${option.label}</button>`)
        .classList('action', classList => {
          option.classes.forEach(cssClass => classList.add(cssClass))
        })
        .addEventListener('action', 'click', (e) => { proceed(e, option.value) })
      popin.append('actions', button)
    })
  }
}

export default Confirm
