'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'

class Confirm {
  constructor (callback, confirmSentence, options) {
    if (typeof confirmSentence === 'undefined') {
      confirmSentence = Translator.__('Confirm:default');
    }

    const buttonClasses = ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'flex', 'items-center', 'p-2']
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

    const close = () => {
      popin.remove()
    }

    const popin = new Brique(`<div class="absolute inset-0 text-white overflow-y-auto p-2 flex flex-col items-center bg-black/80 backdrop-blur-sm" data-var="overlay">
      <div class="flex flex-col items-center gap-2" data-var="menu">
        <button class="bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded p-2 w-full text-xl flex gap-2 items-center justify-center h-12" data-var="close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          ${Translator.__('Menu:close')}
        </button>
      </div>
    </div>`)
    .addEventListener('close', 'click', close)
    .addEventListener('overlay', 'click', close)
    .appendTo(document.body)
  }
}

export default Confirm
