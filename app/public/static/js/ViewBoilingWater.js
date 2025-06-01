'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewBoilingWater {
  constructor ($content) {
    this.history = new History('ViewBoilingWater')

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'volume' || unitType === 'temperature') {
        this.view.forEach('volumeUnit', $unit => { $unit.innerText = this.unit.get('volume').shortLabel })
        this.view.forEach('temperatureUnit', $unit => { $unit.innerText = this.unit.get('temperature').shortLabel })
        this.hideResult()
      }
    })

    this.view = new Brique(
      `<div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 p-2">
          <!-- Volume total désiré -->
          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="totalVolume" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewBoilingWater:Label:totalVolume')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="totalVolume" data-var="totalVolume"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                step="0.1">
              <div class="pointer-events-none" data-var="volumeUnit">
                ${this.unit.get('volume').shortLabel}
              </div>
            </div>
          </div>

          <!-- Température finale désirée -->
          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="finalTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewBoilingWater:Label:finalTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="finalTemp" data-var="finalTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                value="72" step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
            </div>
          </div>

          <!-- Température de l'eau bouillante -->
          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="boilingTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewBoilingWater:Label:boilingTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="boilingTemp" data-var="boilingTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                value="100" step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
            </div>
          </div>

          <!-- Température de l'eau froide -->
          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="coldTemp" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewBoilingWater:Label:coldTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white pr-2 gap-2
                        group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" id="coldTemp" data-var="coldTemp"
                class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                value="20" step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">
                ${this.unit.get('temperature').shortLabel}
              </div>
            </div>
          </div>

          <!-- Bouton Calculer -->
          <div class="w-full sm:w-auto flex flex-col gap-1">
            <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
            <button data-var="action"
              class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm py-1 px-2 text-lg bg-cyan-700
                     hover:bg-transparent hover:text-cyan-700 focus:outline-none focus:bg-transparent focus:text-cyan-700">
              ${Translator.__('Generic:Action:calculate')}
            </button>
          </div>

          <!-- Résultat -->
          <div class="w-full flex flex-col gap-2 hidden" data-var="result">
            <div class="w-full flex flex-col grow gap-1">
              <label for="boilingWaterVolume" class="block text-sm font-medium leading-6">
                ${Translator.__('ViewBoilingWater:Label:boilingWaterVolume')}
              </label>
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 py-1 px-2 text-lg">
                <div class="grow" data-var="boilingWaterVolume"></div>
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
                <button class="hover:text-amber-500" data-var="copyBoilingWaterVolume" 
                        title="${Translator.__('Generic:Action:copy')}"
                        aria-label="${Translator.__('Generic:Action:copy')}">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
                       stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="w-full flex flex-col grow gap-1">
              <label for="coldWaterVolume" class="block text-sm font-medium leading-6">
                ${Translator.__('ViewBoilingWater:Label:coldWaterVolume')}
              </label>
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 py-1 px-2 text-lg">
                <div class="grow" data-var="coldWaterVolume"></div>
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
                <button class="hover:text-amber-500" data-var="copyColdWaterVolume" 
                        title="${Translator.__('Generic:Action:copy')}"
                        aria-label="${Translator.__('Generic:Action:copy')}">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
                       stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div data-var="history"></div>
      </div>`
    )
      .addEventListener('action', 'click', () => {
        this.updateResult()
        this.view.get('action').blur()
      })
      .appendTo($content, true)

    ;['totalVolume', 'finalTemp', 'boilingTemp', 'coldTemp'].forEach((type) => {
      this.view.addEventListener(type, 'keyup', () => {
        this.hideResult()
      })
    })

    this.view.addEventListener('copyBoilingWaterVolume', 'click', () => {
      navigator.clipboard.writeText(this.view.get('boilingWaterVolume').innerText)
      new Confirm(
        () => {},
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

    this.view.addEventListener('copyColdWaterVolume', 'click', () => {
      navigator.clipboard.writeText(this.view.get('coldWaterVolume').innerText)
      new Confirm(
        () => {},
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

    this.renderHistory()
    this.setDefaultValue()
  }

  hideResult () {
    this.view.get('result').classList.add('hidden')
  }

  showResult () {
    this.view.get('result').classList.remove('hidden')
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('totalVolume').value = historyRow.values[0]
        this.view.get('finalTemp').value = historyRow.values[1]
        this.view.get('boilingTemp').value = historyRow.values[2]
        this.view.get('coldTemp').value = historyRow.values[3]
      }
    )
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
      this.unit.set('volume', lastHistory.units[0])
      this.unit.set('temperature', lastHistory.units[1])

      this.view.get('totalVolume').value = lastHistory.values[0]
      this.view.get('finalTemp').value = lastHistory.values[1]
      this.view.get('boilingTemp').value = lastHistory.values[2]
      this.view.get('coldTemp').value = lastHistory.values[3]
      this.updateResult()
    }
  }

  updateResult () {
    const totalVolume = parseFloat(this.view.get('totalVolume').value) || 0
    const finalTemp = parseFloat(this.view.get('finalTemp').value) || 72
    const boilingTemp = parseFloat(this.view.get('boilingTemp').value) || 100
    const coldTemp = parseFloat(this.view.get('coldTemp').value) || 20

    // Calcul du volume d'eau bouillante nécessaire selon la formule :
    // T_f = (m_1 * T_1 + m_2 * T_2) / (m_1 + m_2)
    // où m_1 + m_2 = totalVolume
    // On cherche m_1 (volume d'eau bouillante)
    
    const m1 = totalVolume * (finalTemp - coldTemp) / (boilingTemp - coldTemp)
    const m2 = totalVolume - m1

    this.view.get('boilingWaterVolume').innerText = m1.toFixed(2)
    this.view.get('coldWaterVolume').innerText = m2.toFixed(2)
    this.showResult()

    const display = `${totalVolume}${this.unit.get('volume').shortLabel} → ${m1.toFixed(2)}${this.unit.get('volume').shortLabel} @${boilingTemp}${this.unit.get('temperature').shortLabel} + ${m2.toFixed(2)}${this.unit.get('volume').shortLabel} @${coldTemp}${this.unit.get('temperature').shortLabel} = ${finalTemp}${this.unit.get('temperature').shortLabel}`
    
    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      const values = [totalVolume, finalTemp, boilingTemp, coldTemp]
      const units = [
        this.unit.get('volume').code,
        this.unit.get('temperature').code,
        this.unit.get('temperature').code,
        this.unit.get('temperature').code
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
}

export default ViewBoilingWater 