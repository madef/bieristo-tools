'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewTemperature {
  constructor ($content) {
    this.history = new History('ViewTemperature')
    this.unit = Unit.getInstance()

    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'temperature' || unitType === 'gravity') {
        this.updateResult('staged')
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2">
          <div>
            <label for="gravity" class="block text-sm font-medium leading-6">${Translator.__('ViewTemperature:Label:gravity')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="gravity" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="gravity">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="temperature" class="block text-sm font-medium leading-6">${Translator.__('ViewTemperature:Label:temperature')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="temperature" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="temperature">
                <div class="pointer-events-none whitespace-nowrap" data-var="temperatureUnit">${this.unit.get('temperature').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="col-span-2">
            <label for="total" class="block text-sm font-medium leading-6">${Translator.__('ViewTemperature:Label:total')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="total" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="total">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true);

    ['gravity', 'temperature'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], (e) => {
        this.updateResult(e.type === 'change' ? 'final' : 'staged')
      })
    })

    this.renderHistory()
    this.renderForm()
  }

  renderForm () {
    this.updateResult()
    this.setDefaultValue()
  }

  updateResult (status) {
    let gravity = parseFloat(this.view.get('gravity').value)
    let temperature = parseFloat(this.view.get('temperature').value)

    const unitGravity = this.unit.get('gravity')
    const unitTemperature = this.unit.get('temperature')

    this.view.forEach('gravityUnit', $unit => { $unit.innerText = unitGravity.shortLabel })
    this.view.get('temperatureUnit').innerText = unitTemperature.shortLabel

    if (isNaN(gravity)) {
      if (status !== 'staged') {
        this.view.get('gravity').value = '1.000'
      }

      gravity = 1.0
    }

    if (isNaN(temperature)) {
      if (status !== 'staged') {
        this.view.get('temperature').value = '20'
      }

      temperature = 20
    }

    const ajustedGravity = this.round(
      unitGravity.unconvert(
        (unitGravity.convert(gravity).SG * 1000 + 0.00352871 * Math.pow(unitTemperature.convert(temperature).C - 20, 2) + 0.225225 * (unitTemperature.convert(temperature).C - 20)) / 1000
      ).SG,
      3
    )

    this.view.get('total').value = ajustedGravity

    if (typeof status !== 'undefined') {
      const lastHistory = this.getLastHistory()
      this.cleanLastStagedHistory()

      const values = [
        temperature,
        gravity
      ]

      const units = [
        unitTemperature.code,
        unitGravity.code
      ]

      if (!lastHistory || lastHistory.status === 'staged' || lastHistory.values.toString() !== values.toString() || lastHistory.units.toString() !== units.toString()) {
        const display = Translator.__('ViewTemperature:History:display', {
          gravity,
          temperature,
          ajustedGravity,
          unitGravity: unitGravity.shortLabel,
          unitTemperature: unitTemperature.shortLabel
        })

        this.history.addRow({
          values,
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
      this.view.get('temperature').value = lastHistory.values[0]
      this.view.get('gravity').value = lastHistory.values[1]
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

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('temperature').value = historyRow.values[0]
        this.view.get('gravity').value = historyRow.values[1]
        this.unit.set('temperature', historyRow.units[0])
        this.unit.set('gravity', historyRow.units[1])
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

export default ViewTemperature
