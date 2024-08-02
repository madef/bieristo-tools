'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewAlcool {
  constructor ($content) {
    this.history = new History('ViewAlcool')
    this.unit = Unit.getInstance()

    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'volume' || unitType === 'gravity') {
        this.updateResult('staged')
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2">
          <div>
            <label for="mode" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:mode')}</label>
            <!-- Enabled: "bg-indigo-600", Not Enabled: "bg-gray-200" -->
            <button id="mode" type="button" class="relative inline-flex mt-2 h-10 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" role="switch" aria-checked="false" data-var="refractometerMode" value="on">
              <span class="sr-only">Use setting</span>
              <!-- Enabled: "translate-x-5", Not Enabled: "translate-x-0" -->
              <span aria-hidden="true" class="pointer-events-none inline-block h-9 w-9 translate-x-0 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" data-var="refractometerModeSwitch"></span>
            </button>
          </div>
          <div>
            <label for="sugar" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:sugar')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="sugar" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="sugar">
                <div class="pointer-events-none whitespace-nowrap" data-var="sugarUnit">g/${this.unit.get('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="di" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:di')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="di" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="di">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="df" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:df')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="df" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="df">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="col-span-2">
            <label for="total" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:total')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="total" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="total">
                <div class="pointer-events-none" data-var="volumeUnit">%</div>
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true)
      .addEventListener('refractometerMode', 'click', () => {
        this.switchMode()
        this.updateResult('staged')
      });

    ['di', 'df', 'sugar'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], (e) => {
        this.updateResult(e.type === 'change' ? 'final' : 'staged')
      })
    })

    this.renderHistory()
    this.renderForm()
  }

  renderForm () {
    this.renderSwitch()
    this.updateResult()
    this.setDefaultValue()
  }

  updateResult (status) {
    let di = parseFloat(this.view.get('di').value)
    let df = parseFloat(this.view.get('df').value)
    let sugar = parseFloat(this.view.get('sugar').value)
    const gravity = this.unit.get('gravity')
    const volume = this.unit.get('volume')

    this.view.forEach('gravityUnit', $unit => { $unit.innerText = gravity.shortLabel })
    this.view.get('sugarUnit').innerText = `g/${volume.shortLabel}`

    if (isNaN(di)) {
      if (status !== 'staged') {
        this.view.get('di').value = '1.000'
      }

      di = 1.0
    }

    if (isNaN(df)) {
      if (status !== 'staged') {
        this.view.get('df').value = '1.000'
      }

      df = 1.0
    }

    if (isNaN(sugar)) {
      if (status !== 'staged') {
        this.view.get('sugar').value = '0'
      }

      sugar = 0.0
    }

    const diAjusted = gravity.convert(di).SG
    let dfAjusted = gravity.convert(df).SG
    if (this.isRefractometerMode()) {
      const diBrix = gravity.convert(di).B
      const dfBrix = gravity.convert(df).B
      dfAjusted = 1.001843 -
        0.002318474 * diBrix -
        0.000007775 * Math.pow(diBrix, 2) -
        0.000000034 * Math.pow(diBrix, 3) +
        0.00574 * dfBrix +
        0.00003344 * Math.pow(dfBrix, 2) +
        0.000000086 * Math.pow(dfBrix, 3)
    }

    let abv = 131.25 * (diAjusted - dfAjusted)

    abv = this.round(abv + sugar / volume.convert(1).L / 19.5 / 0.789)

    this.view.get('total').value = abv

    if (abv > 0 && typeof status !== 'undefined') {
      const lastHistory = this.getLastHistory()
      this.cleanLastStagedHistory()

      const values = [
        sugar,
        di,
        df
      ]

      const units = [
        gravity.code,
        volume.code
      ]

      if (!lastHistory || lastHistory.status === 'staged' || lastHistory.values.toString() !== values.toString() || lastHistory.units.toString() !== units.toString()) {
        let display = Translator.__('ViewAlcool:History:classical', {
          di,
          df,
          abv,
          unit: gravity.shortLabel
        })
        if (this.isRefractometerMode()) {
          display = Translator.__('ViewAlcool:History:refractometer', {
            di,
            df,
            dfAjusted: this.round(dfAjusted, 3),
            abv,
            unit: gravity.shortLabel
          })
        }

        this.history.addRow({
          values,
          isRefractometerMode: this.isRefractometerMode(),
          units,
          status,
          display
        })
      }
    }
  }

  getLastHistory () {
    const history = this.history.get()

    if (history.length) {
      return history[0]
    }

    return null
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
      this.view.get('sugar').value = lastHistory.values[0]
      this.view.get('di').value = lastHistory.values[1]
      this.view.get('df').value = lastHistory.values[2]
      if (!lastHistory.isRefractometerMode) {
        this.switchMode()
      }
    }
    this.updateResult()
  }

  cleanLastStagedHistory () {
    const historyList = this.history.get()
    if (historyList.length) {
      const history = historyList[0]
      if (history.status === 'staged') {
        this.history.removeRow(0)
      }
    }
  }

  isRefractometerMode () {
    return this.view.get('refractometerMode').value === 'on'
  }

  switchMode () {
    this.view.get('refractometerMode').value = this.isRefractometerMode() ? 'off' : 'on'

    this.renderSwitch()
  }

  renderSwitch () {
    if (this.isRefractometerMode()) {
      this.view.classList('refractometerMode', (classList) => {
        classList.remove('bg-gray-200')
        classList.add('bg-indigo-600')
      })
      this.view.classList('refractometerModeSwitch', (classList) => {
        classList.remove('translate-x-0')
        classList.add('translate-x-6')
      })
    } else {
      this.view.classList('refractometerMode', (classList) => {
        classList.add('bg-gray-200')
        classList.remove('bg-indigo-600')
      })
      this.view.classList('refractometerModeSwitch', (classList) => {
        classList.remove('translate-x-6')
        classList.add('translate-x-0')
      })
    }
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('sugar').value = historyRow.values[0]
        this.view.get('di').value = historyRow.values[1]
        this.view.get('df').value = historyRow.values[2]
        this.unit.set('gravity', historyRow.units[0])
        this.unit.set('volume', historyRow.units[1])
        if (historyRow.isRefractometerMode !== this.isRefractometerMode()) {
          this.switchMode()
        }

        this.updateResult()
      }
    )
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  getContent () {
    return this.layout.get('content')
  }
}

export default ViewAlcool
