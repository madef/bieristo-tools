'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import Confirm from './Confirm.js'

class BlockHistory {
  constructor ($root, history, copyCallback) {
    this.$root = $root
    this.history = history
    this.copyCallback = copyCallback
    this.history.setChangeObserver(() => this.render())
    this.render()
  }

  render () {
    this.$root.replaceChildren()

    this.history.get().forEach((historyRow, historyKey) => {
      /* eslint-disable no-new */
      new Brique(`<li class="flex flex-wrap odd:bg-box even:bg-zinc-800 p-4 md:justify-between items-center gap-2">
          <div class="p-2 text-sm bg-violet-500 rounded-md text-center flex gap-1 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            ${new Date(historyRow.date).toLocaleString()}
          </div>
          <div class="grow w-full md:w-auto md:text-left flex flex-wrap items-center gap-4">
            ${historyRow.display}
          </div>
          <button class="bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex gap-1 items-center p-2" data-var="copy">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            ${Translator.__('Generic:Action:copy')}
          </button>
          <button class="bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded flex gap-1 items-center p-2" data-var="remove">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            ${Translator.__('Generic:Action:remove')}
          </button>
        </li>`)
        .addEventListener('remove', 'click', () => {
          new Confirm( // eslint-disable-line no-new
            (code) => {
              if (code === 1) {
                this.history.removeRow(historyKey)
                this.render()
              }
            },
            Translator.__('History:Confirm:remove', { entry: historyRow.display })
          )
        })
        .addEventListener('copy', 'click', () => {
          this.copyCallback(historyRow)
        })
        .appendTo(this.$root)
    })
  }
}

export default BlockHistory
