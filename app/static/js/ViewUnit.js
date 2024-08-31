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
        break
      case 'gravity':
        this.unitType = 'gravity'
        break
      case 'temperature':
        this.unitType = 'temperature'
        break
      default:
        this.unitType = 'pressure'
        break
    }

    this.history = new History(`ViewUnit:${this.unitType}`)

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType) => {
      if (this.unitType === unitType) {
        this.updateResult()
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
            <div class="flex flex-wrap md:flex-nowrap items-center gap-2 overflow-x-auto" data-var="result">
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true)

    this.view.addEventListener('value', 'keyup', () => {
      this.updateResult()
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
    const history = this.history.get()

    if (history.length) {
      return history[0]
    }

    return null
  }

  updateResult () {
    const value = parseFloat(this.view.get('value').value)
    const $unit = this.view.get('unit')

    this.view.empty('result')

    if (isNaN(value)) {
      return
    }

    const unit = this.unit.get(this.unitType)
    const convert = unit.convert(value)
    const unconvert = unit.unconvert(value)
    const resultTextList = []
    const altResultTextList = []
    switch (this.unitType) {
      case 'temperature':
        switch (unit.code) {
          case 'C':
            resultTextList.push(`${value}°C → ${this.round(convert.F)}°F`)
            altResultTextList.push(`${value}°F → ${this.round(unconvert.F)}°C`)
            break
          case 'F':
            resultTextList.push(`${value}°F → ${this.round(convert.C)}°C`)
            altResultTextList.push(`${value}°C → ${this.round(unconvert.C)}°F`)
            break
        }

        break
      case 'pressure':
        switch (unit.code) {
          case 'B':
            resultTextList.push(`${value}Bar → ${this.round(convert.PSI)}PSI`)
            altResultTextList.push(`${value}PSI → ${this.round(unconvert.PSI)}Bar`)
            break
          case 'PSI':
            resultTextList.push(`${value}PSI → ${this.round(convert.B)}Bar`)
            altResultTextList.push(`${value}Bar → ${this.round(unconvert.B)}PSI`)
            break
        }

        break
      case 'volume':
        switch (unit.code) {
          case 'L':
            resultTextList.push(`${value}L → ${this.round(convert.G)}Gal`)
            altResultTextList.push(`${value}Gal → ${this.round(unconvert.G)}L`)
            break
          case 'G':
            resultTextList.push(`${value}Gal → ${this.round(convert.L)}L`)
            altResultTextList.push(`${value}L → ${this.round(unconvert.L)}Gal`)
            break
        }

        break
      case 'gravity':
        switch (unit.code) {
          case 'SG':
            resultTextList.push(`${value} SG → ${this.round(convert.P)}°P`)
            resultTextList.push(`${value} SG → ${this.round(convert.B)}°Bx`)
            altResultTextList.push(`${value}°P → ${this.round(unconvert.P)} SG`)
            altResultTextList.push(`${value}°Bx → ${this.round(unconvert.B)} SG`)
            console.log(unconvert)
            break
          case 'P':
            resultTextList.push(`${value}°P → ${this.round(convert.SG)}SG`)
            resultTextList.push(`${value}°P → ${this.round(convert.B)}°Bx`)
            altResultTextList.push(`${value}SG → ${this.round(unconvert.SG)}°P`)
            altResultTextList.push(`${value}°Bx → ${this.round(unconvert.B)}°P`)
            break
          case 'B':
            resultTextList.push(`${value}°Bx → ${this.round(convert.SG)}SG`)
            resultTextList.push(`${value}°Bx → ${this.round(convert.P)}°P`)
            altResultTextList.push(`${value}SG → ${this.round(unconvert.SG)}°Bx`)
            altResultTextList.push(`${value}°Bx → ${this.round(unconvert.P)}°P`)
            break
        }

        break
    }

    resultTextList.forEach((result) => {
      this.view.append(
        'result',
        new Brique(`<div class="flex gap-2 items-center w-full md:w-auto bg-cyan-950 rounded-md p-2">
  <span class="grow">${result}</span>
  <button class="hover:text-amber-500" data-var="history-add" title="${Translator.__('Generic:Action:historyAdd')}" aria-label="${Translator.__('Generic:Action:historyAdd')}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  </button>
</div>`)
          .addEventListener('history-add', 'click', () => {
            if (!this.getLastHistory() || this.getLastHistory().display !== result) {
              this.history.addRow({
                value,
                unit: unit.code,
                display: result
              })
            }
          })
      )
    })

    altResultTextList.forEach((result) => {
      this.view.append(
        'result',
        new Brique(`<div class="flex gap-2 items-center w-full md:w-auto bg-green-800 rounded-md p-2" data-var="result-value">
  <span class="grow">${result}</span>
  <button class="hover:text-amber-500" data-var="history-add" title="${Translator.__('Generic:Action:historyAdd')}" aria-label="${Translator.__('Generic:Action:historyAdd')}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  </button>
</div>`)
          .addEventListener('history-add', 'click', () => {
            if (!this.getLastHistory() || this.getLastHistory().display !== result) {
              this.history.addRow({
                value,
                unit: unit.code,
                display: result
              })
            }
          })
      )
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
}

export default ViewUnit
