'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewPressure {
  constructor ($content, subview) {
    switch (subview) {
      case 'co2':
        this.mode = 'co2'
        break
      default:
        this.mode = 'sugar'
        break
    }

    this.history = new History(`ViewPressure:${this.mode}`)
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
                <select autocomplete="off" id="style" class="rounded-md py-1 px-2 w-full text-lg focus:outline-none bg-main" data-var="style">
                </select>
              </div>
            </div>
          </div>
          <div>
            <label for="temperature" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:temperature')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="temperature" value="4" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="temperature">
                <div class="pointer-events-none whitespace-nowrap" data-var="temperatureUnit">${this.unit.get('temperature').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="min" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:min')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="min" value="1.5" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="min">
                <div class="pointer-events-none whitespace-nowrap" >${Translator.__('ViewPressure:Unit:co2')}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="max" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:max')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="max" value="2" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="max">
                <div class="pointer-events-none whitespace-nowrap" >${Translator.__('ViewPressure:Unit:co2')}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="totalMin" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:TotalMin:' + this.mode)}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 py-1 px-2 text-lg" data-var="totalMin" data-var="totalMin">
              </div>
            </div>
          </div>
          <div>
            <label for="totalMax" class="block text-sm font-medium leading-6">${Translator.__('ViewPressure:Label:TotalMax:' + this.mode)}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 py-1 px-2 text-lg" data-var="totalMax">
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
        this.updateResult()
      })
      .appendTo($content, true);

    ['min', 'max'].forEach((type) => {
      this.view.addEventListener(type, 'keyup', () => {
        this.updateResult()
      })
    })

    this.view.addEventListener('temperature', 'change', () => {
      this.updateResult()
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
    const totalUnit = this.mode === 'co2' ? unitPressure.shortLabel : 'g/L'

    this.view.get('temperatureUnit').innerText = unitTemperature.shortLabel
    this.view.forEach('pressureUnit', $unit => { $unit.innerText = unitPressure.shortLabel })

    if (!isNaN(min)) {
      if (min < 1.5) {
        this.view.get('min').value = '1.5'
        min = 1.5
      } else if (min > 4.3) {
        this.view.get('min').value = '4.3'
        min = 4.3
      }
    }

    if (!isNaN(max)) {
      if (max < 1.5 || max < min) {
        max = min
      } else if (max > 4.3) {
        this.view.get('max').value = 4.3
        max = 4.3
      }
    }

    temperature = unitTemperature.convert(temperature).C
    if (!isNaN(temperature)) {
      if (temperature < 2) {
        this.view.get('temperature').value = unitTemperature.unconvert(2).C
        temperature = 2
      } else if (temperature > 30) {
        this.view.get('temperature').value = unitTemperature.unconvert(30).C
        temperature = 30
      }
    }

    const totalMin = this.getTotal(min, temperature)
    const totalMax = this.getTotal(max, temperature)

    this.view.empty('totalMin')
    this.view.append(
      'totalMin',
      new Brique(`<div class="grow">${totalMin}</div>
  <div>${totalUnit}</div>
  <button class="hover:text-amber-500" data-var="history-add" title="${Translator.__('Generic:Action:historyAdd')}" aria-label="${Translator.__('Generic:Action:historyAdd')}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  </button>
</div>`)
        .addEventListener('history-add', 'click', () => {
          addToHistory()
        })
    )

    this.view.empty('totalMax')
    this.view.append(
      'totalMax',
      new Brique(`<div class="grow">${totalMax}</div>
  <div>${totalUnit}</div>
  <button class="hover:text-amber-500" data-var="history-add" title="${Translator.__('Generic:Action:historyAdd')}" aria-label="${Translator.__('Generic:Action:historyAdd')}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  </button>
</div>`)
        .addEventListener('history-add', 'click', () => {
          addToHistory()
        })
    )

    const addToHistory = () => {
      const values = [
        this.getCurrentStyle().code,
        temperature,
        min,
        max
      ]

      const units = [
        unitTemperature.code,
        unitPressure.code
      ]

      const display = Translator.__(`ViewPressure:History:Display:${this.mode}`, {
        style: this.getCurrentStyle().label,
        temperature,
        min,
        max,
        totalMin,
        totalMax,
        unitPressure: unitPressure.shortLabel,
        unitSugar: 'g/L',
        unitTemperature: unitTemperature.shortLabel
      })

      if (!this.getLastHistory() || this.getLastHistory().display !== display) {
        this.history.addRow({
          values,
          units,
          display
        })
      }
    }
  }

  getSugarGrid () {
    return {
      2: { 2: 1.6, 3: 5.5, 4: 9.5, 1.5: -0.4, 1.6: 0.0, 1.7: 0.4, 1.8: 0.8, 1.9: 1.2, 2.1: 2.0, 2.2: 2.4, 2.3: 2.8, 2.4: 3.2, 2.5: 3.6, 2.6: 4.0, 2.7: 4.4, 2.8: 4.8, 2.9: 5.1, 3.1: 5.9, 3.2: 6.3, 3.3: 6.7, 3.4: 7.1, 3.5: 7.5, 3.6: 7.9, 3.7: 8.3, 3.8: 8.7, 3.9: 9.1, 4.1: 9.9, 4.2: 10.3, 4.3: 10.6 },
      3: { 2: 1.8, 3: 5.7, 4: 9.7, 1.5: -0.2, 1.6: 0.2, 1.7: 0.6, 1.8: 1.0, 1.9: 1.4, 2.1: 2.2, 2.2: 2.6, 2.3: 3.0, 2.4: 3.4, 2.5: 3.8, 2.6: 4.2, 2.7: 4.6, 2.8: 4.9, 2.9: 5.3, 3.1: 6.1, 3.2: 6.5, 3.3: 6.9, 3.4: 7.3, 3.5: 7.7, 3.6: 8.1, 3.7: 8.5, 3.8: 8.9, 3.9: 9.3, 4.1: 10.1, 4.2: 10.4, 4.3: 10.8 },
      4: { 2: 2.0, 3: 6.0, 4: 9.9, 1.5: 0.1, 1.6: 0.5, 1.7: 0.9, 1.8: 1.3, 1.9: 1.6, 2.1: 2.4, 2.2: 2.8, 2.3: 3.2, 2.4: 3.6, 2.5: 4.0, 2.6: 4.4, 2.7: 4.8, 2.8: 5.2, 2.9: 5.6, 3.1: 6.4, 3.2: 6.8, 3.3: 7.1, 3.4: 7.5, 3.5: 7.9, 3.6: 8.3, 3.7: 8.7, 3.8: 9.1, 3.9: 9.5, 4.1: 10.3, 4.2: 10.7, 4.3: 11.1 },
      5: { 2: 2.2, 3: 6.2, 4: 10.1, 1.5: 0.3, 1.6: 0.7, 1.7: 1.1, 1.8: 1.5, 1.9: 1.8, 2.1: 2.6, 2.2: 3.0, 2.3: 3.4, 2.4: 3.8, 2.5: 4.2, 2.6: 4.6, 2.7: 5.0, 2.8: 5.4, 2.9: 5.8, 3.1: 6.6, 3.2: 7.0, 3.3: 7.3, 3.4: 7.7, 3.5: 8.1, 3.6: 8.5, 3.7: 8.9, 3.8: 9.3, 3.9: 9.7, 4.1: 10.5, 4.2: 10.9, 4.3: 11.3 },
      6: { 2: 2.4, 3: 6.4, 4: 10.3, 1.5: 0.5, 1.6: 0.9, 1.7: 1.3, 1.8: 1.6, 1.9: 2.0, 2.1: 2.8, 2.2: 3.2, 2.3: 3.6, 2.4: 4.0, 2.5: 4.4, 2.6: 4.8, 2.7: 5.2, 2.8: 5.6, 2.9: 6.0, 3.1: 6.8, 3.2: 7.1, 3.3: 7.5, 3.4: 7.9, 3.5: 8.3, 3.6: 8.7, 3.7: 9.1, 3.8: 9.5, 3.9: 9.9, 4.1: 10.7, 4.2: 11.1, 4.3: 11.5 },
      7: { 2: 2.6, 3: 6.6, 4: 10.5, 1.5: 0.7, 1.6: 1.1, 1.7: 1.5, 1.8: 1.8, 1.9: 2.2, 2.1: 3.0, 2.2: 3.4, 2.3: 3.8, 2.4: 4.2, 2.5: 4.6, 2.6: 5.0, 2.7: 5.4, 2.8: 5.8, 2.9: 6.2, 3.1: 7.0, 3.2: 7.3, 3.3: 7.7, 3.4: 8.1, 3.5: 8.5, 3.6: 8.9, 3.7: 9.3, 3.8: 9.7, 3.9: 10.1, 4.1: 10.9, 4.2: 11.3, 4.3: 11.7 },
      8: { 2: 2.8, 3: 6.7, 4: 10.6, 1.5: 0.8, 1.6: 1.2, 1.7: 1.6, 1.8: 2.0, 1.9: 2.4, 2.1: 3.2, 2.2: 3.6, 2.3: 4.0, 2.4: 4.4, 2.5: 4.8, 2.6: 5.1, 2.7: 5.5, 2.8: 5.9, 2.9: 6.3, 3.1: 7.1, 3.2: 7.5, 3.3: 7.9, 3.4: 8.3, 3.5: 8.7, 3.6: 9.1, 3.7: 9.5, 3.8: 9.9, 3.9: 10.3, 4.1: 11.0, 4.2: 11.4, 4.3: 11.8 },
      9: { 2: 3.0, 3: 6.9, 4: 10.8, 1.5: 1.0, 1.6: 1.4, 1.7: 1.8, 1.8: 2.2, 1.9: 2.6, 2.1: 3.4, 2.2: 3.8, 2.3: 4.2, 2.4: 4.6, 2.5: 4.9, 2.6: 5.3, 2.7: 5.7, 2.8: 6.1, 2.9: 6.5, 3.1: 7.3, 3.2: 7.7, 3.3: 8.1, 3.4: 8.5, 3.5: 8.9, 3.6: 9.3, 3.7: 9.7, 3.8: 10.1, 3.9: 10.4, 4.1: 11.2, 4.2: 11.6, 4.3: 12.0 },
      10: { 2: 3.1, 3: 7.1, 4: 11.0, 1.5: 1.2, 1.6: 1.6, 1.7: 2.0, 1.8: 2.4, 1.9: 2.7, 2.1: 3.5, 2.2: 3.9, 2.3: 4.3, 2.4: 4.7, 2.5: 5.1, 2.6: 5.5, 2.7: 5.9, 2.8: 6.3, 2.9: 6.7, 3.1: 7.5, 3.2: 7.9, 3.3: 8.2, 3.4: 8.6, 3.5: 9.0, 3.6: 9.4, 3.7: 9.8, 3.8: 10.2, 3.9: 10.6, 4.1: 11.4, 4.2: 11.8, 4.3: 12.2 },
      11: { 2: 3.3, 3: 7.2, 4: 11.2, 1.5: 1.3, 1.6: 1.7, 1.7: 2.1, 1.8: 2.5, 1.9: 2.9, 2.1: 3.7, 2.2: 4.1, 2.3: 4.5, 2.4: 4.9, 2.5: 5.3, 2.6: 5.7, 2.7: 6.0, 2.8: 6.4, 2.9: 6.8, 3.1: 7.6, 3.2: 8.0, 3.3: 8.4, 3.4: 8.8, 3.5: 9.2, 3.6: 9.6, 3.7: 10.0, 3.8: 10.4, 3.9: 10.8, 4.1: 11.5, 4.2: 11.9, 4.3: 12.3 },
      12: { 2: 3.5, 3: 7.4, 4: 11.3, 1.5: 1.5, 1.6: 1.9, 1.7: 2.3, 1.8: 2.7, 1.9: 3.1, 2.1: 3.8, 2.2: 4.2, 2.3: 4.6, 2.4: 5.0, 2.5: 5.4, 2.6: 5.8, 2.7: 6.2, 2.8: 6.6, 2.9: 7.0, 3.1: 7.8, 3.2: 8.2, 3.3: 8.6, 3.4: 9.0, 3.5: 9.3, 3.6: 9.7, 3.7: 10.1, 3.8: 10.5, 3.9: 10.9, 4.1: 11.7, 4.2: 12.1, 4.3: 12.5 },
      13: { 2: 3.6, 3: 7.5, 4: 11.5, 1.5: 1.6, 1.6: 2.0, 1.7: 2.4, 1.8: 2.8, 1.9: 3.2, 2.1: 4.0, 2.2: 4.4, 2.3: 4.8, 2.4: 5.2, 2.5: 5.6, 2.6: 6.0, 2.7: 6.4, 2.8: 6.8, 2.9: 7.1, 3.1: 7.9, 3.2: 8.3, 3.3: 8.7, 3.4: 9.1, 3.5: 9.5, 3.6: 9.9, 3.7: 10.3, 3.8: 10.7, 3.9: 11.1, 4.1: 11.9, 4.2: 12.3, 4.3: 12.6 },
      14: { 2: 3.8, 3: 7.7, 4: 11.6, 1.5: 1.8, 1.6: 2.2, 1.7: 2.6, 1.8: 3.0, 1.9: 3.4, 2.1: 4.2, 2.2: 4.6, 2.3: 4.9, 2.4: 5.3, 2.5: 5.7, 2.6: 6.1, 2.7: 6.5, 2.8: 6.9, 2.9: 7.3, 3.1: 8.1, 3.2: 8.5, 3.3: 8.9, 3.4: 9.3, 3.5: 9.7, 3.6: 10.1, 3.7: 10.4, 3.8: 10.8, 3.9: 11.2, 4.1: 12.0, 4.2: 12.4, 4.3: 12.8 },
      15: { 2: 3.9, 3: 7.8, 4: 11.7, 1.5: 1.9, 1.6: 2.3, 1.7: 2.7, 1.8: 3.1, 1.9: 3.5, 2.1: 4.3, 2.2: 4.7, 2.3: 5.1, 2.4: 5.5, 2.5: 5.9, 2.6: 6.2, 2.7: 6.6, 2.8: 7.0, 2.9: 7.4, 3.1: 8.2, 3.2: 8.6, 3.3: 9.0, 3.4: 9.4, 3.5: 9.8, 3.6: 10.2, 3.7: 10.6, 3.8: 11.0, 3.9: 11.4, 4.1: 12.1, 4.2: 12.5, 4.3: 12.9 },
      16: { 2: 4.0, 3: 7.9, 4: 11.9, 1.5: 2.0, 1.6: 2.4, 1.7: 2.8, 1.8: 3.2, 1.9: 3.6, 2.1: 4.4, 2.2: 4.8, 2.3: 5.2, 2.4: 5.6, 2.5: 6.0, 2.6: 6.4, 2.7: 6.8, 2.8: 7.1, 2.9: 7.5, 3.1: 8.3, 3.2: 8.7, 3.3: 9.1, 3.4: 9.5, 3.5: 9.9, 3.6: 10.3, 3.7: 10.7, 3.8: 11.1, 3.9: 11.5, 4.1: 12.3, 4.2: 12.6, 4.3: 13.0 },
      17: { 2: 4.2, 3: 8.1, 4: 12.0, 1.5: 2.2, 1.6: 2.6, 1.7: 3.0, 1.8: 3.4, 1.9: 3.8, 2.1: 4.6, 2.2: 4.9, 2.3: 5.3, 2.4: 5.7, 2.5: 6.1, 2.6: 6.5, 2.7: 6.9, 2.8: 7.3, 2.9: 7.7, 3.1: 8.5, 3.2: 8.9, 3.3: 9.3, 3.4: 9.7, 3.5: 10.1, 3.6: 10.4, 3.7: 10.8, 3.8: 11.2, 3.9: 11.6, 4.1: 12.4, 4.2: 12.8, 4.3: 13.2 },
      18: { 2: 4.2, 3: 8.2, 4: 12.1, 1.5: 2.3, 1.6: 2.7, 1.7: 3.1, 1.8: 3.5, 1.9: 3.8, 2.1: 4.6, 2.2: 5.0, 2.3: 5.4, 2.4: 5.8, 2.5: 6.2, 2.6: 6.6, 2.7: 7.0, 2.8: 7.4, 2.9: 7.8, 3.1: 8.6, 3.2: 9.0, 3.3: 9.3, 3.4: 9.7, 3.5: 10.1, 3.6: 10.5, 3.7: 10.9, 3.8: 11.3, 3.9: 11.7, 4.1: 12.5, 4.2: 12.9, 4.3: 13.3 },
      19: { 2: 4.4, 3: 8.3, 4: 12.2, 1.5: 2.4, 1.6: 2.8, 1.7: 3.2, 1.8: 3.6, 1.9: 4.0, 2.1: 4.8, 2.2: 5.1, 2.3: 5.5, 2.4: 5.9, 2.5: 6.3, 2.6: 6.7, 2.7: 7.1, 2.8: 7.5, 2.9: 7.9, 3.1: 8.7, 3.2: 9.1, 3.3: 9.5, 3.4: 9.9, 3.5: 10.3, 3.6: 10.6, 3.7: 11.0, 3.8: 11.4, 3.9: 11.8, 4.1: 12.6, 4.2: 13.0, 4.3: 13.4 },
      20: { 2: 4.5, 3: 8.4, 4: 12.3, 1.5: 2.5, 1.6: 2.9, 1.7: 3.3, 1.8: 3.7, 1.9: 4.1, 2.1: 4.9, 2.2: 5.3, 2.3: 5.7, 2.4: 6.0, 2.5: 6.4, 2.6: 6.8, 2.7: 7.2, 2.8: 7.6, 2.9: 8.0, 3.1: 8.8, 3.2: 9.2, 3.3: 9.6, 3.4: 10.0, 3.5: 10.4, 3.6: 10.8, 3.7: 11.2, 3.8: 11.5, 3.9: 11.9, 4.1: 12.7, 4.2: 13.1, 4.3: 13.5 },
      21: { 2: 4.6, 3: 8.5, 4: 12.4, 1.5: 2.6, 1.6: 3.0, 1.7: 3.4, 1.8: 3.8, 1.9: 4.2, 2.1: 4.9, 2.2: 5.3, 2.3: 5.7, 2.4: 6.1, 2.5: 6.5, 2.6: 6.9, 2.7: 7.3, 2.8: 7.7, 2.9: 8.1, 3.1: 8.9, 3.2: 9.3, 3.3: 9.7, 3.4: 10.1, 3.5: 10.4, 3.6: 10.8, 3.7: 11.2, 3.8: 11.6, 3.9: 12.0, 4.1: 12.8, 4.2: 13.2, 4.3: 13.6 },
      22: { 2: 4.7, 3: 8.6, 4: 12.5, 1.5: 2.7, 1.6: 3.1, 1.7: 3.5, 1.8: 3.9, 1.9: 4.3, 2.1: 5.1, 2.2: 5.5, 2.3: 5.9, 2.4: 6.2, 2.5: 6.6, 2.6: 7.0, 2.7: 7.4, 2.8: 7.8, 2.9: 8.2, 3.1: 9.0, 3.2: 9.4, 3.3: 9.8, 3.4: 10.2, 3.5: 10.6, 3.6: 11.0, 3.7: 11.4, 3.8: 11.7, 3.9: 12.1, 4.1: 12.9, 4.2: 13.3, 4.3: 13.7 },
      23: { 2: 4.8, 3: 8.7, 4: 12.6, 1.5: 2.8, 1.6: 3.2, 1.7: 3.6, 1.8: 4.0, 1.9: 4.4, 2.1: 5.1, 2.2: 5.5, 2.3: 5.9, 2.4: 6.3, 2.5: 6.7, 2.6: 7.1, 2.7: 7.5, 2.8: 7.9, 2.9: 8.3, 3.1: 9.1, 3.2: 9.5, 3.3: 9.9, 3.4: 10.3, 3.5: 10.6, 3.6: 11.0, 3.7: 11.4, 3.8: 11.8, 3.9: 12.2, 4.1: 13.0, 4.2: 13.4, 4.3: 13.8 },
      24: { 2: 4.8, 3: 8.8, 4: 12.7, 1.5: 2.9, 1.6: 3.3, 1.7: 3.7, 1.8: 4.0, 1.9: 4.4, 2.1: 5.2, 2.2: 5.6, 2.3: 6.0, 2.4: 6.4, 2.5: 6.8, 2.6: 7.2, 2.7: 7.6, 2.8: 8.0, 2.9: 8.4, 3.1: 9.2, 3.2: 9.5, 3.3: 9.9, 3.4: 10.3, 3.5: 10.7, 3.6: 11.1, 3.7: 11.5, 3.8: 11.9, 3.9: 12.3, 4.1: 13.1, 4.2: 13.5, 4.3: 13.9 },
      25: { 2: 4.9, 3: 8.8, 4: 12.7, 1.5: 2.9, 1.6: 3.3, 1.7: 3.7, 1.8: 4.1, 1.9: 4.5, 2.1: 5.3, 2.2: 5.7, 2.3: 6.0, 2.4: 6.4, 2.5: 6.8, 2.6: 7.2, 2.7: 7.6, 2.8: 8.0, 2.9: 8.4, 3.1: 9.2, 3.2: 9.6, 3.3: 10.0, 3.4: 10.4, 3.5: 10.8, 3.6: 11.2, 3.7: 11.5, 3.8: 11.9, 3.9: 12.3, 4.1: 13.1, 4.2: 13.5, 4.3: 13.9 },
      26: { 2: 4.9, 3: 8.9, 4: 12.8, 1.5: 3.0, 1.6: 3.4, 1.7: 3.8, 1.8: 4.2, 1.9: 4.6, 2.1: 5.3, 2.2: 5.7, 2.3: 6.1, 2.4: 6.5, 2.5: 6.9, 2.6: 7.3, 2.7: 7.7, 2.8: 8.1, 2.9: 8.5, 3.1: 9.3, 3.2: 9.7, 3.3: 10.1, 3.4: 10.4, 3.5: 10.8, 3.6: 11.2, 3.7: 11.6, 3.8: 12.0, 3.9: 12.4, 4.1: 13.2, 4.2: 13.6, 4.3: 14.0 },
      27: { 2: 5.0, 3: 8.9, 4: 12.8, 1.5: 3.0, 1.6: 3.4, 1.7: 3.8, 1.8: 4.2, 1.9: 4.6, 2.1: 5.4, 2.2: 5.8, 2.3: 6.2, 2.4: 6.6, 2.5: 7.0, 2.6: 7.3, 2.7: 7.7, 2.8: 8.1, 2.9: 8.5, 3.1: 9.3, 3.2: 9.7, 3.3: 10.1, 3.4: 10.5, 3.5: 10.9, 3.6: 11.3, 3.7: 11.7, 3.8: 12.1, 3.9: 12.5, 4.1: 13.2, 4.2: 13.6, 4.3: 14.0 },
      28: { 2: 5.0, 3: 9.0, 4: 12.9, 1.5: 3.1, 1.6: 3.5, 1.7: 3.8, 1.8: 4.2, 1.9: 4.6, 2.1: 5.4, 2.2: 5.8, 2.3: 6.2, 2.4: 6.6, 2.5: 7.0, 2.6: 7.4, 2.7: 7.8, 2.8: 8.2, 2.9: 8.6, 3.1: 9.3, 3.2: 9.7, 3.3: 10.1, 3.4: 10.5, 3.5: 10.9, 3.6: 11.3, 3.7: 11.7, 3.8: 12.1, 3.9: 12.5, 4.1: 13.3, 4.2: 13.7, 4.3: 14.1 },
      29: { 2: 5.1, 3: 9.0, 4: 12.9, 1.5: 3.1, 1.6: 3.5, 1.7: 3.9, 1.8: 4.3, 1.9: 4.7, 2.1: 5.5, 2.2: 5.9, 2.3: 6.2, 2.4: 6.6, 2.5: 7.0, 2.6: 7.4, 2.7: 7.8, 2.8: 8.2, 2.9: 8.6, 3.1: 9.4, 3.2: 9.8, 3.3: 10.2, 3.4: 10.6, 3.5: 11.0, 3.6: 11.4, 3.7: 11.7, 3.8: 12.1, 3.9: 12.5, 4.1: 13.3, 4.2: 13.7, 4.3: 14.1 },
      30: { 2: 5.1, 3: 9.0, 4: 13.0, 1.5: 3.1, 1.6: 3.5, 1.7: 3.9, 1.8: 4.3, 1.9: 4.7, 2.1: 5.5, 2.2: 5.9, 2.3: 6.3, 2.4: 6.7, 2.5: 7.1, 2.6: 7.5, 2.7: 7.9, 2.8: 8.2, 2.9: 8.6, 3.1: 9.4, 3.2: 9.8, 3.3: 10.2, 3.4: 10.6, 3.5: 11.0, 3.6: 11.4, 3.7: 11.8, 3.8: 12.2, 3.9: 12.6, 4.1: 13.4, 4.2: 13.7, 4.3: 14.1 }
    }
  }

  getTotal (value, temperature) {
    if (this.mode === 'sugar') {
      const line = this.getSugarGrid()[parseInt(temperature)]
      return line[parseInt(value * 10) / 10]
    } else {
      const res = value * 1.98 // Convert to g/l
      const unitPressure = this.unit.get('pressure')

      return this.round(
        unitPressure.unconvert(
          0.000260165 * Math.pow(temperature, 2) +
          temperature * (0.0109218 * res + 0.00799664) -
          0.0012163 * (res - 278.507) * (res - 3.22065)
        ).B,
        2
      )
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
      this.view.get('temperature').value = lastHistory.values[1]
      this.view.get('min').value = lastHistory.values[2]
      this.view.get('max').value = lastHistory.values[3]
    }
    this.updateResult()
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('style').value = historyRow.values[0]
        this.view.get('temperature').value = historyRow.values[1]
        this.view.get('min').value = historyRow.values[2]
        this.view.get('max').value = historyRow.values[3]
        this.unit.set('temperature', historyRow.units[0])
        this.unit.set('pressure', historyRow.units[1])
        this.updateResult()
      }
    )
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }
}

export default ViewPressure
