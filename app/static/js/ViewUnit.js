'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewUnit {
  constructor ($content, subview) {
    switch (subview) {
      case 'volume':
         this.unitType = 'volume'
         break;
      case 'gravity':
         this.unitType = 'gravity'
         break;
      case 'temperature':
         this.unitType = 'temperature'
         break;
      default:
         this.unitType = 'pressure'
         break;
    }

    this.history = new History('ViewUnit:' + this.unitType)

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType) => {
      if (this.unitType === unitType) {
        this.updateResult('staged')
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div>
          <label for="${this.unitType}" class="block text-sm font-medium leading-6">${Translator.__(`ViewUnit:Label:${this.unitType}`)}</label>
          <div class="grid md:grid-cols-2 gap-2">
            <div>
              <div class="relative rounded-md shadow-sm flex gap-2">
                <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                  <input type="number" autocomplete="off" id="${this.unitType}" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="value">
                  <div class="pointer-events-none" data-var="unit">${this.unit.get(this.unitType).shortLabel}</div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 overflow-x-auto" data-var="result">
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true);

    this.view.addEventListener('value', ['keyup', 'change'], (e) => {
      this.updateResult(e.type === 'change' ? 'final' : 'staged')
    })

    this.renderHistory()
    this.setDefaultValue()
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
      this.view.get('value').value = lastHistory.value
      this.updateResult()
    }
  }

  getLastHistory () {
    for (const history of this.history.get()) {
      return history
    }

    return null
  }

  cleanLastStagedHistory () {
    const historyList = this.history.get()
    for (const historyKey in historyList) {
      const history = historyList[historyKey]
      if (history.status === 'staged') {
        this.history.removeRow(historyKey)
      }
      return
    }
  }

  updateResult (status) {
    const value = parseFloat(this.view.get('value').value)
    const $unit = this.view.get(`unit`)

    this.view.empty(`result`)

    if (isNaN(value)) {
      return
    }

    const unit = this.unit.get(this.unitType)
    const convert = unit.convert(value)
    const resultTextList = []
    let history = ''
    switch (this.unitType) {
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
      const lastHistory = this.getLastHistory()
      this.cleanLastStagedHistory()
      if (!lastHistory || lastHistory.status === 'staged' || lastHistory.value !== value || lastHistory.unit !== unit.code) {
        this.history.addRow({
          value,
          unit: unit.code,
          status,
          display: history
        })
      }
    }

    resultTextList.forEach((result) => {
      this.view.append('result', new Brique(`<div class="bg-cyan-950 rounded-md p-2">${result}</div>`))
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
        this.view.get('value').value = historyRow.value
        this.unit.set(this.unitType, historyRow.unit)
        this.updateResult()
      }
    )
  }

  getContent () {
    return this.layout.get('content')
  }
}

export default ViewUnit
