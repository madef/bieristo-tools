'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewMaischeTemp {
  constructor ($content) {
    this.history = new History('ViewMaischeTemp')
    this.unit = Unit.getInstance()

    this.unit.addChangeObserver('view', (unitType, oldUnitCode) => {
      switch (unitType) {
        case 'temperature':
          this.view.forEach('temperatureUnit', ($el) => {
            $el.innerText = this.unit.get('temperature').shortLabel
          })

          this.convert('targetMashTemp', 'temperature', oldUnitCode)
          this.convert('grainInitialTemp', 'temperature', oldUnitCode)

          this.hideResult()
          break
        case 'volume':
          this.view.forEach('volumeUnit', ($el) => {
            $el.innerText = this.unit.get('volume').shortLabel
          })

          this.convert('waterVolume', 'volume', oldUnitCode)

          this.hideResult()
          break
        case 'weight':
          this.view.forEach('weightUnit', ($el) => {
            $el.innerText = this.unit.get('weight').shortLabel
          })

          this.convert('grainWeight', 'weight', oldUnitCode)

          this.hideResult()
          break
      }
    })

    this.view = new Brique(
      `<div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 p-2">
          <div class="w-full md:w-1/5 flex flex-col grow gap-1">
            <label for="grainWeight" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewMaischeTemp:Label:grainWeight')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2 group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="grainWeight" data-var="grainWeight"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="weightUnit">
                ${this.unit.get('weight').shortLabel}
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/5 flex flex-col grow gap-1">
            <label for="waterVolume" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewMaischeTemp:Label:waterVolume')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2 group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="waterVolume" data-var="waterVolume"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="volumeUnit">
                ${this.unit.get('volume').shortLabel}
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/5 flex flex-col grow gap-1">
            <label for="targetMashTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewMaischeTemp:Label:targetMashTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2 group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="targetMashTemp" data-var="targetMashTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
            </div>
          </div>

          <div class="w-full md:w-1/5 flex flex-col grow gap-1">
            <label for="grainInitialTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewMaischeTemp:Label:grainInitialTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2 group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="grainInitialTemp" data-var="grainInitialTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                value="${this.unit.get('temperature').unconvert(20).C}" step="0.1">
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

          <div class="w-full flex flex-col grow gap-1 hidden" data-var="result">
            <label for="requiredWaterTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewMaischeTemp:Label:requiredWaterTemp')}
            </label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly id="requiredWaterTemp" data-var="requiredWaterTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyRequiredTemp"
                title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184
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

    ;['grainWeight', 'waterVolume', 'targetMashTemp', 'grainInitialTemp'].forEach((key) => {
      this.view.addEventListener(key, ['keyup', 'change'], () => {
        this.hideResult()
      })
    })

    this.view.addEventListener('copyRequiredTemp', 'click', () => {
      navigator.clipboard.writeText(this.view.get('requiredWaterTemp').value)
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
    const historyItems = this.history.get()
    return historyItems.length ? historyItems[0] : null
  }

  setDefaultValue () {
    const last = this.getLastHistory()
    if (last) {
      this.unit.set('weight', last.units[0])
      this.unit.set('volume', last.units[1])
      this.unit.set('temperature', last.units[2])

      this.view.get('grainWeight').value = last.values[0]
      this.view.get('waterVolume').value = last.values[1]
      this.view.get('targetMashTemp').value = last.values[2]
      this.view.get('grainInitialTemp').value = last.values[3]
      this.updateResult()
    }
  }

  updateResult () {
    const grainWeight = parseFloat(this.view.get('grainWeight').value) || 0
    const waterVolume = parseFloat(this.view.get('waterVolume').value) || 0
    const targetMashTemp = parseFloat(this.view.get('targetMashTemp').value) || 0
    const grainInitialTemp = parseFloat(this.view.get('grainInitialTemp').value) || 20
    const requiredTemp = this.calculateWaterTemperature(
      grainWeight,
      waterVolume,
      targetMashTemp,
      grainInitialTemp
    )

    this.view.get('requiredWaterTemp').value = requiredTemp
    this.showResult()

    const display = `${targetMashTemp}${this.unit.get('temperature').shortLabel}, ${grainWeight}${this.unit.get('weight').shortLabel}, ${waterVolume}${this.unit.get('volume').shortLabel} => ${requiredTemp}${this.unit.get('temperature').shortLabel}`

    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      const values = [
        grainWeight,
        waterVolume,
        targetMashTemp,
        grainInitialTemp
      ]

      const units = [
        this.unit.get('weight').code,
        this.unit.get('volume').code,
        this.unit.get('temperature').code
      ]

      this.history.addRow({ values, units, display })
    }
  }

  renderHistory () {
    new BlockHistory(this.view.get('history'), this.history, (row) => { // eslint-disable-line no-new
      this.unit.set('weight', row.units[0])
      this.unit.set('volume', row.units[1])
      this.unit.set('temperature', row.units[2])

      this.view.get('grainWeight').value = row.values[0]
      this.view.get('waterVolume').value = row.values[1]
      this.view.get('targetMashTemp').value = row.values[2]
      this.view.get('grainInitialTemp').value = row.values[3]

      this.hideResult()
    })
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

  calculateWaterTemperature (
    grainWeight,
    waterVolume,
    targetMashTemp,
    grainInitialTemp
  ) {
    const volume = this.unit.get('volume')
    const temperature = this.unit.get('temperature')
    const weight = this.unit.get('weight')

    const temp = 0.41 / volume.convert(waterVolume).L * weight.convert(grainWeight).g / 1000 * (temperature.convert(targetMashTemp).C - temperature.convert(grainInitialTemp).C) + temperature.convert(targetMashTemp).C
    return parseFloat(temperature.unconvert(temp).C.toFixed(2))
  }
}

export default ViewMaischeTemp
