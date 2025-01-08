'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewTemperature {
  constructor ($content) {
    this.history = new History('ViewTemperature')
    this.unit = Unit.getInstance()

    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'temperature' || unitType === 'gravity') {
        this.view.forEach('gravityUnit', $unit => { $unit.innerText = this.unit.get('gravity').shortLabel })
        this.view.get('temperatureUnit').innerText = this.unit.get('temperature').shortLabel
        this.hideResult()
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 p-2">
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="gravity" class="block text-sm font-medium leading-6">${Translator.__('ViewTemperature:Label:gravity')}</label>
            <div class="relative rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="gravity" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="gravity">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/4 flex flex-col grow gap-1">
            <label for="temperature" class="block text-sm font-medium leading-6">${Translator.__('ViewTemperature:Label:temperature')}</label>
            <div class="relative rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="temperature" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="temperature">
                <div class="pointer-events-none whitespace-nowrap" data-var="temperatureUnit">${this.unit.get('temperature').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-auto flex flex-col gap-1">
            <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
            <button data-var="action" class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm rounded-md py-1 px-2 text-lg bg-cyan-700 focus:outline-none focus:bg-transparent hover:bg-transparent focus:text-cyan-700 hover:text-cyan-700">
              ${Translator.__('Generic:Action:calculate')}
            </buton>
          </div>
          <div class="w-full flex flex-col grow gap-1 hidden" data-var="result">
            <label for="bottomVolume" class="block text-sm font-medium leading-6">${Translator.__('ViewTemperature:Label:total')}</label>
            <div class="flex grow w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="bottomVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="total">
              <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copy" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
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

    this.view.addEventListener('copy', 'click', () => {
      navigator.clipboard.writeText(this.view.get('total').value)
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

    ;['gravity', 'temperature'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], () => {
        this.hideResult()
      })
    })

    this.view.addEventListener('action', 'click', () => {
      this.updateResult()
      this.view.get('action').blur()
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
    const gravity = parseFloat(this.view.get('gravity').value)
    const temperature = parseFloat(this.view.get('temperature').value)

    const unitGravity = this.unit.get('gravity')
    const unitTemperature = this.unit.get('temperature')

    const ajustedGravity = this.round(
      unitGravity.unconvert(
        (unitGravity.convert(gravity).SG + 0.00352871 * Math.pow(unitTemperature.convert(temperature).C - 20, 2) + 0.225225 * (unitTemperature.convert(temperature).C - 20))
      ).SG,
      3
    )

    this.showResult()
    this.view.get('total').value = ajustedGravity

    const display = Translator.__('ViewTemperature:History:display', {
      gravity,
      temperature,
      ajustedGravity,
      unitGravity: unitGravity.shortLabel,
      unitTemperature: unitTemperature.shortLabel
    })

    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      const values = [
        temperature,
        gravity
      ]

      const units = [
        unitTemperature.code,
        unitGravity.code
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
      this.view.get('temperature').value = lastHistory.values[0]
      this.view.get('gravity').value = lastHistory.values[1]
      this.updateResult()
    }
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('temperature').value = historyRow.values[0]
        this.view.get('gravity').value = historyRow.values[1]
        this.unit.set('temperature', historyRow.units[0])
        this.unit.set('gravity', historyRow.units[1])
        this.hideResult()
      }
    )
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }
}

export default ViewTemperature
