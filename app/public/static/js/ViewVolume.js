'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewVolume {
  constructor ($content) {
    this.history = new History('ViewVolume')

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'volume' || unitType === 'length') {
        this.view.forEach('volumeUnit', $unit => { $unit.innerText = this.unit.get('volume').shortLabel })
        this.view.forEach('lengthUnit', $unit => { $unit.innerText = this.unit.get('length').shortLabel })

        this.hideResult()
      }
    })

    this.view = new Brique(
      `<div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 p-2">
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="bottomHeight" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:bottomHeight')}</label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white group hover:border-amber-500 focus-within:border-amber-500 pr-2 gap-2">
                <input type="number" autocomplete="off" id="bottomHeight" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="bottomHeight">
                <div class="pointer-events-none" data-var="lengthUnit">${this.unit.get('length').shortLabel}</div>
            </div>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="tankHeight" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:tankHeight')}</label>
            <div class="relative rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="tankHeight" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="tankHeight">
                <div class="pointer-events-none" data-var="lengthUnit">${this.unit.get('length').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="diameter" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:diameter')}</label>
            <div class="relative rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="diameter" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="diameter">
                <div class="pointer-events-none" data-var="lengthUnit">${this.unit.get('length').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-auto flex flex-col gap-1">
            <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
            <button data-var="action" class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm rounded-md py-1 px-2 text-lg bg-cyan-700 focus:outline-none focus:bg-transparent hover:bg-transparent focus:text-cyan-700 hover:text-cyan-700">
              ${Translator.__('Generic:Action:calculate')}
            </buton>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="bottomVolume" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:bottomVolume')}</label>
            <div class="flex grow w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="bottomVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="bottomVolume">
              <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyBottomVolume" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="tankVolume" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:tankVolume')}</label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="tankVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="tankVolume">
              <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyTankVolume" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="totalVolume" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:totalVolume')}</label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="totalVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="totalVolume">
              <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyTotalVolume" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div data-var="history">
        </div>
      </div>`
    ).appendTo($content, true)

    this.setDefaultValue()

    ;[
      { button: 'copyBottomVolume', input: 'bottomVolume' },
      { button: 'copyTankVolume', input: 'tankVolume' },
      { button: 'copyTotalVolume', input: 'totalVolume' }
    ].forEach((action) => {
      this.view.addEventListener(action.button, 'click', () => {
        navigator.clipboard.writeText(this.view.get(action.input).value)
        new Confirm( // eslint-disable-line no-new
          () => {
          },
          Translator.__('Generic:Confirm:copy'),
          [
            {
              label: Translator.__('Generic:ok'),
              classes: ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto', 'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'],
              value: 0
            }
          ]
        )
      })
    })

    this.view.addEventListener('action', 'click', () => {
      this.updateResult()
      this.view.get('action').blur()
    })

    ;['bottomHeight', 'tankHeight', 'diameter'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], () => {
        this.hideResult()
      })
    })

    this.renderHistory()
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
      this.view.get('bottomHeight').value = lastHistory.values[0]
      this.view.get('tankHeight').value = lastHistory.values[1]
      this.view.get('diameter').value = lastHistory.values[2]
      this.updateResult()
    }
  }

  getLastHistory () {
    const history = this.history.get()

    if (history.length) {
      return history[0]
    }

    return null
  }

  hideResult () {
    this.view.forEach('result', $result => { $result.classList.add('hidden') })
  }

  showResult () {
    this.view.forEach('result', $result => { $result.classList.remove('hidden') })
  }

  updateResult () {
    const bottomHeight = parseFloat(this.view.get('bottomHeight').value)
    const tankHeight = parseFloat(this.view.get('tankHeight').value)
    const diameter = parseFloat(this.view.get('diameter').value)
    const length = this.unit.get('length')
    const volume = this.unit.get('volume')

    const calculVolume = (height) => {
      return this.round(volume.unconvert(Math.PI * Math.pow(length.convert(diameter).cm / 2, 2) * length.convert(height).cm / 1000).L)
    }

    const total = this.round(calculVolume(bottomHeight) + calculVolume(tankHeight))

    this.view.get('bottomVolume').value = calculVolume(bottomHeight)
    this.view.get('tankVolume').value = calculVolume(tankHeight)
    this.view.get('totalVolume').value = this.round(total)
    this.showResult()

    const display = `${diameter}${length.shortLabel}  ⌀ x (${bottomHeight} + ${tankHeight}) = ${total} ${volume.shortLabel}`
    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      const values = [
        bottomHeight,
        tankHeight,
        diameter
      ]

      const units = [
        length.code,
        volume.code
      ]

      this.history.addRow({
        values,
        units,
        display
      })
    }
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('bottomHeight').value = historyRow.values[0]
        this.view.get('tankHeight').value = historyRow.values[1]
        this.view.get('diameter').value = historyRow.values[2]
        this.unit.set('length', historyRow.units[0])
        this.unit.set('volume', historyRow.units[1])
        this.hideResult()
      }
    )
  }
}

export default ViewVolume
