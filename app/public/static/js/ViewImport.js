'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import Confirm from './Confirm.js'

class ViewImport {
  constructor ($content) {
    this.view = new Brique(`<div class="flex flex-col items-center gap-4">
        <div class="flex flex-col md:w-1/3 lg:w-1/3 gap-2 pt-4">
          <div class="flex flex-col gap-4">
            <button class="text-lg bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex justify-between items-center p-4" data-var="save">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              ${Translator.__('ViewImport:save')}
            </button>
            <button class="text-lg bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex justify-between items-center p-4" data-var="open">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>

              ${Translator.__('ViewImport:open')}
            </button>
            <input type="file" class="invisible w-0 absolute" data-var="file" accept=".bieristo.json" />
            <button class="text-lg bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded flex justify-between items-center p-4" data-var="remove">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              ${Translator.__('ViewImport:remove')}
            </button>
          </div>
        </div>
      </div>`)
      .appendTo($content, true)
      .addEventListener('remove', 'click', () => {
        new Confirm( // eslint-disable-line no-new
          (code) => {
            if (code === 1) {
              localStorage.clear() // eslint-disable-line no-undef
            }
          },
          Translator.__('ViewImport:Confirm:remove')
        )
      })
      .addEventListener('open', 'click', () => {
        this.view.get('file').click()
      })
      .addEventListener('file', 'change', (e) => {
        const file = e.target.files[0]
        if (!file) {
          this.displayError(Translator.__('ViewImport:Error:cannotLoadFile'))
          return
        }

        const reader = new FileReader() // eslint-disable-line no-undef
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            localStorage.clear() // eslint-disable-line no-undef
            for (const [key, value] of Object.entries(data)) {
              localStorage.setItem(key, value) // eslint-disable-line no-undef
            }
          } catch (e) {
            console.error(e)
            this.displayError(Translator.__('ViewImport:Error:invalidSyntax'))
          }
        }
        reader.readAsText(file)
      })
      .addEventListener('save', 'click', () => {
        const link = document.createElement('a')
        link.download = `${Translator.__('ViewImport:filename')}_${new Date().toLocaleString().replaceAll(' ', '-')}.bieristo.json`
        const blob = new Blob([JSON.stringify(localStorage)], { type: 'text/plain' }) // eslint-disable-line no-undef
        link.href = window.URL.createObjectURL(blob)
        link.click()
      })
  }

  displayError (message) {
    new Confirm( // eslint-disable-line no-new
      () => {
      },
      message,
      [
        {
          label: Translator.__('Generic:ok'),
          classes: ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto', 'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'],
          value: 0
        }
      ]
    )
  }
}

export default ViewImport
