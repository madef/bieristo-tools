'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewUpdateMaischeTemp {
  constructor ($content) {
    this.history = new History('ViewUpdateMaischeTemp')
    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('viewUpdateMaischeTemp', (unitType, oldUnitCode) => {
      switch (unitType) {
        case 'temperature':
          this.view.forEach('temperatureUnit', ($el) => {
            $el.innerText = this.unit.get('temperature').shortLabel
          })

          this.convert('mashTemp', 'temperature', oldUnitCode)
          this.convert('targetTemp', 'temperature', oldUnitCode)
          this.convert('waterTemp', 'temperature', oldUnitCode)

          this.hideResult()
          break
        case 'volume':
          this.view.forEach('volumeUnit', ($el) => {
            $el.innerText = this.unit.get('volume').shortLabel
          })

          this.convert('mashVolume', 'volume', oldUnitCode)

          this.hideResult()
          break
      }
    })

    this.view = new Brique(
      `<div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 p-2">
          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="mashVolume" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewUpdateMaischeTemp:Label:mashVolume')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="mashVolume" data-var="mashVolume"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="volumeUnit">
                ${this.unit.get('volume').shortLabel}
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="mashTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewUpdateMaischeTemp:Label:mashTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="mashTemp" data-var="mashTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="targetTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewUpdateMaischeTemp:Label:targetTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="targetTemp" data-var="targetTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="waterTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewUpdateMaischeTemp:Label:waterTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="waterTemp" data-var="waterTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
            </div>
          </div>

          <div class="w-full sm:w-auto flex flex-col gap-1">
            <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
            <button data-var="action"
              class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm py-1 px-2 text-lg bg-cyan-700
                     hover:bg-transparent hover:text-cyan-700 focus:outline-none focus:bg-transparent focus:text-cyan-700">
              ${Translator.__('Generic:Action:calculate')}
            </button>
          </div>

          <div class="w-full md:w-1/3 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="waterToAdd" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewUpdateMaischeTemp:Label:waterToAdd')}
            </label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly id="waterToAdd" data-var="waterToAdd"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none">
              <div class="pointer-events-none" data-var="volumeUnit">
                ${this.unit.get('volume').shortLabel}
              </div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyWaterToAdd"
                title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0
                    a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184
                    1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257
                    c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div data-var="history"></div>
      </div>`
    ).appendTo($content, true)

    this.view.addEventListener('action', 'click', () => {
      this.updateResult()
      this.view.get('action').blur()
    })

    ;['mashVolume', 'mashTemp', 'targetTemp', 'waterTemp'].forEach((key) => {
      this.view.addEventListener(key, ['keyup', 'change'], () => {
        this.hideResult()
      })
    })

    this.view.addEventListener('copyWaterToAdd', 'click', () => {
      navigator.clipboard.writeText(this.view.get('waterToAdd').value)
      new Confirm(() => {}, Translator.__('Generic:Confirm:copy'), [{ // eslint-disable-line no-new
        label: Translator.__('Generic:ok'),
        classes: [
          'hover:bg-transparent',
          'focus:bg-transparent',
          'rounded',
          'p-2',
          'grow',
          'text-center',
          'w-full',
          'md:w-auto',
          'bg-teal-700',
          'hover:text-teal-700',
          'focus:text-teal-700'
        ],
        value: 0
      }])
    })

    this.renderHistory()
    this.setDefaultValue()
  }

  hideResult () {
    this.view.forEach('result', ($el) => {
      $el.classList.add('hidden')
    })
  }

  showResult () {
    this.view.forEach('result', ($el) => {
      $el.classList.remove('hidden')
    })
  }

  getLastHistory () {
    const list = this.history.get()
    return list.length ? list[0] : null
  }

  setDefaultValue () {
    const last = this.getLastHistory()
    if (last) {
      this.unit.set('volume', last.units[0])
      this.unit.set('temperature', last.units[1])

      this.view.get('mashVolume').value = last.values[0]
      this.view.get('mashTemp').value = last.values[1]
      this.view.get('targetTemp').value = last.values[2]
      this.view.get('waterTemp').value = last.values[3]
      this.updateResult()
    }
  }

  updateResult () {
    const mashVolume = parseFloat(this.view.get('mashVolume').value) || 0
    const mashTemp = parseFloat(this.view.get('mashTemp').value) || 0
    const targetTemp = parseFloat(this.view.get('targetTemp').value) || 0
    const waterTemp = parseFloat(this.view.get('waterTemp').value) || 0
    let addedWater

    try {
      addedWater = this.calculateWaterToAdd(mashVolume, mashTemp, targetTemp, waterTemp)
    } catch (err) {
      this.view.get('waterToAdd').value = err.message
      this.showResult()
      return
    }

    this.view.get('waterToAdd').value = addedWater.toFixed(2)

    this.showResult()

    const display = `${mashVolume}${this.unit.get('volume').shortLabel} @${mashTemp}${this.unit.get('temperature').shortLabel} + ${addedWater.toFixed(2)}${this.unit.get('volume').shortLabel} @${waterTemp}${this.unit.get('temperature').shortLabel} = ${this.round(mashVolume + addedWater)}${this.unit.get('volume').shortLabel} @${targetTemp}${this.unit.get('temperature').shortLabel}`
    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      const values = [mashVolume, mashTemp, targetTemp, waterTemp]
      const units = [
        this.unit.get('volume').code,
        this.unit.get('temperature').code
      ]
      this.history.addRow({ values, units, display })
    }
  }

  convert (input, unitType, oldUnitCode) {
    const unit = this.unit.get(unitType)
    const value = parseFloat(this.view.get(input).value)

    if (isNaN(value)) {
      return
    }

    this.view.get(input).value = this.round(unit.unconvert(value)[oldUnitCode])
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  renderHistory () {
    new BlockHistory(this.view.get('history'), this.history, (row) => { // eslint-disable-line no-new
      this.unit.set('volume', row.units[0])
      this.unit.set('temperature', row.units[1])

      this.view.get('mashVolume').value = row.values[0]
      this.view.get('mashTemp').value = row.values[1]
      this.view.get('targetTemp').value = row.values[2]
      this.view.get('waterTemp').value = row.values[3]
      this.hideResult()
    })
  }

  calculateWaterToAdd (mashVolume, mashTemp, targetTemp, waterTemp) {
    const deltaMash = targetTemp - mashTemp
    const deltaWater = waterTemp - targetTemp
    if (deltaWater === 0) throw new Error(Translator.__('ViewUpdateMaischeTemp:DeltaTemp:invalid'))
    return (mashVolume * deltaMash) / deltaWater
  }
}

export default ViewUpdateMaischeTemp
