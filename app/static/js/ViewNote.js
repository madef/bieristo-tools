'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Confirm from './Confirm.js'

class ViewNote {
  constructor ($content) {
    this.history = new History('ViewNote')

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div>
          <label for="note" class="block text-sm font-medium leading-6">${Translator.__('ViewNote:label')}</label>
          <div class="flex flex-wrap md:flex-nowrap w-full items-stretch gap-2 rounded-md">
            <textarea autocomplete="off" id="note" class="h-32 md:h-16 border border-white hover:border-amber-500 focus-within:border-amber-500 rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="note"></textarea>
            <button class="bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex gap-1 justify-center items-center p-4 w-full md:w-auto" data-var="action">${Translator.__('ViewNote:submit')}</button>
          </div>
        </div>
        <div class="flex flex-col gap-2 pt-4">
          <div class="flex justify-end gap-2">
            <button class="bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex gap-1 items-center p-2" data-var="copy">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              ${Translator.__('ViewNote:copy')}
            </button>
            <button class="bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded flex gap-1 items-center p-2" data-var="remove">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              ${Translator.__('ViewNote:remove')}
            </button>
          </div>
          <ul data-var="history" class="border border-zinc-700 rounded">
          </ul>
        </div>
      </div>`)
      .appendTo($content, true)
      .addEventListener('action', 'click', () => {
        if (this.view.get('note').value.length) {
          this.history.addRow({
            value: this.view.get('note').value,
            status: 'final',
            display: this.view.get('note').value.replaceAll('\n', '<br>')
          })
          this.view.get('note').value = ''
        }
      })
      .addEventListener('remove', 'click', () => {
        new Confirm( // eslint-disable-line no-new
          (code) => {
            if (code === 1) {
              this.history.clear()
            }
          },
          Translator.__('ViewNote:Confirm:remove')
        )
      })
      .addEventListener('copy', 'click', () => {
        const lineList = []
        this.history.get().forEach((historyRow, historyKey) => {
          lineList.push(`${new Date(historyRow.date).toLocaleString()}: ${historyRow.value.replaceAll('\n', '\n                     ')}`)
        })

        navigator.clipboard.writeText(lineList.reverse().join('\n'))

        new Confirm( // eslint-disable-line no-new
          (code) => {
            if (code === 1) {
              this.history.clear()
            }
          },
          Translator.__('ViewNote:Confirm:copy'),
          [
            {
              label: Translator.__('Generic:ok'),
              classes: ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto', 'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'],
              value: 0
            }
          ]
        )
      })

    this.renderHistory()
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('note').value = historyRow.value
      }
    )
  }

  getContent () {
    return this.layout.get('content')
  }
}

export default ViewNote
