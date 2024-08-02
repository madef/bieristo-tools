'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewUnit {
  constructor ($content) {
    this.history = new History('ViewUnit')

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType) => {
      this.updateResult(unitType, 'staged')
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2">
          <div>
            <label for="pressure" class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:pressure')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="pressure" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="pressure">
                <div class="pointer-events-none" data-var="pressureUnit">${this.unit.get('pressure').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="pressureResult">
              </div>
            </div>
          </div>
          <div>
            <label for="volume" class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:volume')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="volume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="volume">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="volumeResult">
              </div>
            </div>
          </div>
          <div>
            <label for="gravity" class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:gravity')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="gravity" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="gravity">
                <div class="pointer-events-none" data-var="gravityUnit">${this.unit.get('gravity').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="gravityResult">
              </div>
            </div>
          </div>
          <div>
            <label for="temperature" class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:temperature')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="temperature" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="temperature">
                <div class="pointer-events-none" data-var="temperatureUnit">${this.unit.get('temperature').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="temperatureResult">
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true);

    ['temperature', 'pressure', 'volume', 'gravity'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], (e) => {
        this.updateResult(type, e.type === 'change' ? 'final' : 'staged')
      })
    })

    this.renderHistory()
    this.setDefaultValue()
  }

  setDefaultValue () {
    ['temperature', 'pressure', 'volume', 'gravity'].forEach((type) => {
      const lastHistory = this.getLastHistory(type)
      if (lastHistory) {
        this.view.get(type).value = lastHistory.value
        this.updateResult(type)
      }
    })
  }

  getLastHistory (type) {
    for (const history of this.history.get()) {
      if (history.type === type) {
        return history
      }
    }

    return null
  }

  cleanLastStagedHistory (type) {
    const historyList = this.history.get()
    for (const historyKey in historyList) {
      const history = historyList[historyKey]
      if (history.type === type) {
        if (history.status === 'staged') {
          this.history.removeRow(historyKey)
        }
        return
      }
    }
  }

  updateResult (type, status) {
    const value = parseFloat(this.view.get(type).value)
    const $unit = this.view.get(`${type}Unit`)

    this.view.empty(`${type}Result`)

    if (isNaN(value)) {
      return
    }

    const unit = this.unit.get(type)
    const convert = unit.convert(value)
    const resultTextList = []
    let history = ''
    switch (type) {
      case 'temperature':
        switch (unit.code) {
          case 'C':
            resultTextList.push(`${this.round(convert.F)}°F`)
            break
          case 'F':
            resultTextList.push(`${this.round(convert.C)}°C`)
            break
        }

        history = `${value}${unit.shortLabel} = ${resultTextList.join(', ')}`
        break
      case 'pressure':
        switch (unit.code) {
          case 'B':
            resultTextList.push(`${this.round(convert.PSI)} PSI`)
            break
          case 'PSI':
            resultTextList.push(`${this.round(convert.B)} Bar`)
            break
        }

        history = `${value} ${unit.shortLabel} = ${resultTextList.join(', ')}`
        break
      case 'volume':
        switch (unit.code) {
          case 'L':
            resultTextList.push(`${this.round(convert.G)} Gal`)
            break
          case 'G':
            resultTextList.push(`${this.round(convert.L)} L`)
            break
        }

        history = `${value} ${unit.shortLabel} = ${resultTextList.join(', ')}`
        break
      case 'gravity':
        switch (unit.code) {
          case 'SG':
            resultTextList.push(`${this.round(convert.P)}°P`)
            resultTextList.push(`${this.round(convert.B)}°Bx`)
            break
          case 'P':
            resultTextList.push(`${this.round(convert.SG, 3)}°SG`)
            resultTextList.push(`${this.round(convert.B)}°Bx`)
            break
          case 'B':
            resultTextList.push(`${this.round(convert.SG, 3)}°SG`)
            resultTextList.push(`${this.round(convert.P)}°P`)
            break
        }

        history = `${value} ${unit.shortLabel} = ${resultTextList.join(', ')}`
        break
    }

    if (typeof status !== 'undefined') {
      const lastHistory = this.getLastHistory(type)
      this.cleanLastStagedHistory(type)
      if (!lastHistory || lastHistory.status === 'staged' || lastHistory.value !== value || lastHistory.unit !== unit.code) {
        this.history.addRow({
          type,
          value,
          unit: unit.code,
          status,
          display: history
        })
      }
    }

    resultTextList.forEach((result) => {
      this.view.append(`${type}Result`, new Brique(`<div class="bg-cyan-950 rounded-md p-2">${result}</div>`))
    })

    $unit.innerText = `${unit.shortLabel}`
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get(historyRow.type).value = historyRow.value
        this.unit.set(historyRow.type, historyRow.unit)
        this.updateResult(historyRow.type)
      }
    )
  }

  getContent () {
    return this.layout.get('content')
  }
}

export default ViewUnit
