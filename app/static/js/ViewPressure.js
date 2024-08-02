'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewPressure {
  constructor ($content) {
    this.history = new History('ViewPressure')
    this.unit = Unit.getInstance()

    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'temperature' || unitType === 'pressure') {
        this.updateResult('staged')
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2">
          <div>
            <label for="style" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:style')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <select autocomplete="off" id="style" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="style">
                </select>
              </div>
            </div>
          </div>
          <div>
            <label for="temperature" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:temperature')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="temperature" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="temperature">
                <div class="pointer-events-none whitespace-nowrap" data-var="temperatureUnit">${this.unit.get('temperature').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="min" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:min')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="min" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="min">
                <div class="pointer-events-none whitespace-nowrap" >${Translator.__('ViewPressure:Unit:co2')}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="max" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:max')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="max" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="max">
                <div class="pointer-events-none whitespace-nowrap" >${Translator.__('ViewPressure:Unit:co2')}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="pressureMin" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:pressureMin')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="pressureMin" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="pressureMin">
                <div class="pointer-events-none" data-var="pressureUnit">${this.unit.get('pressure').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="pressureMax" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:pressureMax')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="pressureMax" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="pressureMax">
                <div class="pointer-events-none" data-var="pressureUnit">${this.unit.get('pressure').shortLabel}</div>
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .addEventListener('style', 'change', () => {
        this.view.get('min').value = this.getCurrentStyle().min
        this.view.get('max').value = this.getCurrentStyle().max
        this.updateResult('final')
      })
      .appendTo($content, true);

    ['min', 'max', 'temperature'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], (e) => {
        this.updateResult(e.type === 'change' ? 'final' : 'staged')
      })
    })

    this.renderStyleList()
    this.renderHistory()
    this.renderForm()
  }

  renderStyleList () {
    for (const style of this.getStyleList()) {
      this.view.append('style', new Brique(`<option value="${style.code}">${style.label}</option>`))
    }
  }

  getCurrentStyle () {
    for (const style of this.getStyleList()) {
      if (style.code === this.view.get('style').value) {
        return style
      }
    }
  }

  getStyleList () {
    return [
      {
        code: 'bri',
        label: Translator.__('ViewPressure:Style:bri'),
        min: 1.5,
        max: 2
      },
      {
        code: 'ipa',
        label: Translator.__('ViewPressure:Style:ipa'),
        min: 1.5,
        max: 2.3
      },
      {
        code: 'strong',
        label: Translator.__('ViewPressure:Style:strong'),
        min: 1.5,
        max: 2.3
      },
      {
        code: 'stout-porter',
        label: Translator.__('ViewPressure:Style:stout-porter'),
        min: 1.7,
        max: 2.3
      },
      {
        code: 'barleywine',
        label: Translator.__('ViewPressure:Style:barleywine'),
        min: 1.5,
        max: 2.3
      },
      {
        code: 'american',
        label: Translator.__('ViewPressure:Style:american'),
        min: 2.5,
        max: 2.9
      },
      {
        code: 'apa',
        label: Translator.__('ViewPressure:Style:apa'),
        min: 2.3,
        max: 2.8
      },
      {
        code: 'belge',
        label: Translator.__('ViewPressure:Style:belge'),
        min: 1.9,
        max: 2.4
      },
      {
        code: 'double',
        label: Translator.__('ViewPressure:Style:double'),
        min: 1.5,
        max: 2.3
      },
      {
        code: 'lambic',
        label: Translator.__('ViewPressure:Style:lambic'),
        min: 2.4,
        max: 2.8
      },
      {
        code: 'gueuze',
        label: Translator.__('ViewPressure:Style:gueuze'),
        min: 3,
        max: 4.3
      },
      {
        code: 'belge-ble',
        label: Translator.__('ViewPressure:Style:belge-ble'),
        min: 2.1,
        max: 2.6
      },
      {
        code: 'lager-eu',
        label: Translator.__('ViewPressure:Style:lager-eu'),
        min: 2.2,
        max: 2.7
      },
      {
        code: 'vienna',
        label: Translator.__('ViewPressure:Style:vienna'),
        min: 2.4,
        max: 2.6
      },
      {
        code: 'cream-oktoberfest',
        label: Translator.__('ViewPressure:Style:cream-oktoberfest'),
        min: 2.6,
        max: 2.7
      },
      {
        code: 'marzen',
        label: Translator.__('ViewPressure:Style:marzen'),
        min: 2.8,
        max: 2.8
      },
      {
        code: 'german-ble',
        label: Translator.__('ViewPressure:Style:german-ble'),
        min: 3.3,
        max: 4.3
      },
      {
        code: 'altbier',
        label: Translator.__('ViewPressure:Style:altbier'),
        min: 2.1,
        max: 3.1
      }
    ]
  }

  renderForm () {
    this.updateResult()
    this.setDefaultValue()
  }

  updateResult (status) {
    let min = parseFloat(this.view.get('min').value)
    let max = parseFloat(this.view.get('max').value)
    let temperature = parseFloat(this.view.get('temperature').value)

    const unitTemperature = this.unit.get('temperature')
    const unitPressure = this.unit.get('pressure')

    this.view.get('temperatureUnit').innerText = unitTemperature.shortLabel

    if (isNaN(min)) {
      if (status !== 'staged') {
        this.view.get('min').value = '1.5'
      }

      min = 1.5
    } else if (min < 1.5) {
      this.view.get('min').value = '1.5'
      min = 1.5
    } else if (min > 4.3) {
      this.view.get('min').value = '4.3'
      min = 4.3
    }

    if (isNaN(max)) {
      if (status !== 'staged') {
        this.view.get('max').value = '4.3'
      }

      max = 4.3
    } else if (max < 1.5 || max < min) {
      this.view.get('max').value = min
      max = min
    } else if (max > 4.3) {
      this.view.get('max').value = 4.3
      max = 4.3
    }

    if (isNaN(temperature) || temperature < 2) {
      if (status !== 'staged') {
        this.view.get('temperature').value = '8'
      }

      temperature = 8
    } else if (temperature < 2) {
      this.view.get('temperature').value = '2'
      temperature = 2
    } else if (temperature > 30) {
      this.view.get('temperature').value = '30'
      temperature = 30
    }

    const minRes = min * 1.98 // Convert to g/l
    const pressureMin = this.round(
      unitPressure.unconvert(
        0.000260165 * Math.pow(unitTemperature.convert(temperature).C, 2) +
        unitTemperature.convert(temperature).C * (0.0109218 * minRes + 0.00799664) -
        0.0012163 * (minRes - 278.507) * (minRes - 3.22065)
      ).B,
      2
    )

    const maxRes = max * 1.98 // Convert to g/l
    const pressureMax = this.round(
      unitPressure.unconvert(
        0.000260165 * Math.pow(unitTemperature.convert(temperature).C, 2) +
        unitTemperature.convert(temperature).C * (0.0109218 * maxRes + 0.00799664) -
        0.0012163 * (maxRes - 278.507) * (maxRes - 3.22065)
      ).B,
      2
    )

    this.view.get('pressureMin').value = pressureMin
    this.view.get('pressureMax').value = pressureMax

    if (typeof status !== 'undefined') {
      const lastHistory = this.getLastHistory()
      this.cleanLastStagedHistory()

      const values = [
        this.getCurrentStyle().code,
        min,
        max
      ]

      const units = [
        unitTemperature.code,
        unitPressure.code
      ]

      if (!lastHistory || lastHistory.status === 'staged' || lastHistory.values.toString() !== values.toString() || lastHistory.units.toString() !== units.toString()) {
        const display = Translator.__('ViewPressure:History:display', {
          style: this.getCurrentStyle().label,
          temperature,
          min,
          max,
          pressureMin,
          pressureMax,
          unitPressure: unitPressure.shortLabel,
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
      this.view.get('style').value = lastHistory.values[0]
      this.view.get('min').value = lastHistory.values[1]
      this.view.get('max').value = lastHistory.values[2]
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
        this.view.get('min').value = historyRow.values[1]
        this.view.get('max').value = historyRow.values[2]
        this.unit.set('temperature', historyRow.units[0])
        this.unit.set('pressure', historyRow.units[1])
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

export default ViewPressure
