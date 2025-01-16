'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewAlcool {
  constructor ($content, subview) {
    switch (subview) {
      case 'densimeter':
        this.mode = 'densimeter'
        break
      case 'mixed':
        this.mode = 'mixed'
        break
      default:
        this.mode = 'refractometer'
        break
    }

    this.history = new History(`ViewAlcool:${this.mode}`)
    this.unit = Unit.getInstance()

    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'volume' || unitType === 'gravity') {
        this.view.forEach('gravityUnit', $unit => { $unit.innerText = this.unit.get('gravity').shortLabel })
        this.view.get('sugarUnit').innerText = `g/${this.unit.get('volume').shortLabel}`

        this.hideResult()
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 p-2">
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="sugar" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:sugar')}</label>
            <div class="relative rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="sugar" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="sugar">
                <div class="pointer-events-none whitespace-nowrap" data-var="sugarUnit">g/${this.unit.get('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="di" class="block text-sm font-medium leading-6">${Translator.__(this.isMixedMode() ? 'ViewAlcool:Label:dfDensimeter' : 'ViewAlcool:Label:di')}</label>
            <div class="relative rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="di" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="di">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="df" class="block text-sm font-medium leading-6">${Translator.__(this.isMixedMode() ? 'ViewAlcool:Label:dfRefractometer' : 'ViewAlcool:Label:df')}</label>
            <div class="relative rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="df" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="df">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-auto flex flex-col gap-1">
            <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
            <button data-var="action" class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm rounded-md py-1 px-2 text-lg bg-cyan-700 focus:outline-none focus:bg-transparent hover:bg-transparent focus:text-cyan-700 hover:text-cyan-700">
              ${Translator.__('Generic:Action:calculate')}
            </buton>
          </div>
          <div class="w-full md:w-1/5 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="totalSugar" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:sugarImpact')}</label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="totalSugar" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="totalSugar">
              <div class="pointer-events-none">%</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyTotalSugar" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full md:w-1/5 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="totalDi" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:diAjusted')}</label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="totalDi" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="totalDi">
              <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyTotalDi" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full md:w-1/5 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="totalDf" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:dfAjusted')}</label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="totalDf" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="totalDf">
              <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyTotalDf" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>
          <div class="w-full md:w-1/5 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="total" class="block text-sm font-medium leading-6">${Translator.__('ViewAlcool:Label:total')}</label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="total" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="total">
              <div class="pointer-events-none" data-var="volumeUnit">%</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copyTotal" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div data-var="history">
        </div>
      </div>`)
      .appendTo($content, true)

    ;['di', 'df', 'sugar'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], () => {
        this.hideResult()
      })
    })

    ;[
      { button: 'copyTotalSugar', input: 'totalSugar' },
      { button: 'copyTotalDi', input: 'totalDi' },
      { button: 'copyTotalDf', input: 'totalDf' },
      { button: 'copyTotal', input: 'total' }
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
    })

    this.renderHistory()
    this.renderForm()
  }

  renderForm () {
    this.setDefaultValue()
  }

  hideResult () {
    this.view.forEach('result', $result => { $result.classList.add('hidden') })
  }

  showResult () {
    this.view.forEach('result', $result => { $result.classList.remove('hidden') })
  }

  updateResult () {
    let di = parseFloat(this.view.get('di').value)
    let df = parseFloat(this.view.get('df').value)
    const sugar = parseFloat(this.view.get('sugar').value || 0)
    const gravity = this.unit.get('gravity')
    const volume = this.unit.get('volume')

    let diAjusted = gravity.convert(di).SG / 1000
    let dfAjusted = gravity.convert(df).SG / 1000
    let calculatedDi

    const fixDf = (di, df) => {
      const gravity = this.unit.getUnit('gravity', 'SG')
      const diBrix = gravity.convert(di).B
      const dfBrix = gravity.convert(df).B
      return 1.001843 -
        0.002318474 * diBrix -
        0.000007775 * Math.pow(diBrix, 2) -
        0.000000034 * Math.pow(diBrix, 3) +
        0.00574 * dfBrix +
        0.00003344 * Math.pow(dfBrix, 2) +
        0.000000086 * Math.pow(dfBrix, 3)
    }

    if (this.isRefractometerMode()) {
      dfAjusted = fixDf(di, df)
    } else if (this.isMixedMode()) {
      calculatedDi = diAjusted // Mesure au densimetre
      let calculatedDf = fixDf(calculatedDi, diAjusted)

      while (calculatedDf >= diAjusted) { // di => mesure au densimetre
        calculatedDi = calculatedDi + 0.001
        calculatedDf = fixDf(calculatedDi, dfAjusted)
        if (calculatedDf <= diAjusted) {
          break
        }
      }

      diAjusted = calculatedDi
      dfAjusted = gravity.convert(di).SG / 1000 // Mesure au densimetre
    }

    let abv = 131.25 * (diAjusted - dfAjusted)

    const sugarImpact = this.round(sugar / volume.convert(1).L / 19.5 / 0.789)

    abv = this.round(abv + sugarImpact)

    if (gravity.code === 'SG') {
      di = gravity.convert(di).SG
      df = gravity.convert(df).SG
      diAjusted = gravity.convert(diAjusted).SG
      dfAjusted = gravity.convert(dfAjusted).SG
    }

    this.showResult()
    this.view.get('totalSugar').value = sugarImpact
    this.view.get('totalDi').value = diAjusted
    this.view.get('totalDf').value = dfAjusted
    this.view.get('total').value = abv

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
        dfAjusted: this.round(gravity.unconvert(dfAjusted).SG, 2),
        abv,
        unit: gravity.shortLabel
      })
    } else if (this.isMixedMode()) {
      display = Translator.__('ViewAlcool:History:mixed', {
        di: this.round(gravity.unconvert(calculatedDi * 1000).SG, 2),
        dfDens: di,
        dfRef: df,
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
      this.updateResult()
    }
  }

  isRefractometerMode () {
    return this.mode === 'refractometer'
  }

  isMixedMode () {
    return this.mode === 'mixed'
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
      }
    )
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }
}

export default ViewAlcool
