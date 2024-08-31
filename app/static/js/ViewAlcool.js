'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewAlcool {
  constructor ($content, subview) {
    switch (subview) {
      case 'densimeter':
        this.mode = 'densimeter'
        break
      default:
        this.mode = 'refractometer'
        break
    }

    this.history = new History(`ViewAlcool:${this.mode}`)
    this.unit = Unit.getInstance()

    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'volume' || unitType === 'gravity') {
        this.updateResult()
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-3 gap-2">
          <div>
            <label for="sugar" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:sugar')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="sugar" value="0" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="sugar">
                <div class="pointer-events-none whitespace-nowrap" data-var="sugarUnit">g/${this.unit.get('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="di" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:di')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="di" value="1.200" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="di">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="df" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:df')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="df" value="1.000" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="df">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="md:col-span-3">
            <div class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:total')}</div>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2 group py-1 px-2 text-lg" data-var="total">
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true);

    ['di', 'df', 'sugar'].forEach((type) => {
      this.view.addEventListener(type, 'keyup', () => {
        this.updateResult()
      })
    })

    this.renderHistory()
    this.renderForm()
  }

  renderForm () {
    this.updateResult()
    this.setDefaultValue()
  }

  updateResult () {
    let di = parseFloat(this.view.get('di').value)
    let df = parseFloat(this.view.get('df').value)
    let sugar = parseFloat(this.view.get('sugar').value)
    const gravity = this.unit.get('gravity')
    const volume = this.unit.get('volume')

    this.view.forEach('gravityUnit', $unit => { $unit.innerText = gravity.shortLabel })
    this.view.get('sugarUnit').innerText = `g/${volume.shortLabel}`

    if (isNaN(di)) {
      di = 1.0
    }

    if (isNaN(df)) {
      df = 1.0
    }

    if (isNaN(sugar)) {
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

    this.view.empty('total')
    this.view.append(
      'total',
      new Brique(`<div class="grow">${abv}</div>
  <div>%</div>
  <button class="hover:text-amber-500" data-var="history-add" title="${Translator.__('Generic:Action:historyAdd')}" aria-label="${Translator.__('Generic:Action:historyAdd')}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  </button>
</div>`)
    )
      .addEventListener('history-add', 'click', () => {
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

        if (!this.getLastHistory() || this.getLastHistory().display !== display) {
          const values = [
            sugar,
            di,
            df
          ]

          const units = [
            gravity.code,
            volume.code
          ]

          this.history.addRow({
            values,
            units,
            display
          })
        }
      })
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
    }
    this.updateResult()
  }

  isRefractometerMode () {
    return this.mode === 'refractometer'
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

        this.updateResult()
      }
    )
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }
}

export default ViewAlcool
