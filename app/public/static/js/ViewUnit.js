'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewUnit {
  constructor ($content, subview) {
    this.history = new History('ViewUnit')
    this.unit = Unit.getInstance()

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="p-2">
          <div class="flex flex-wrap md:flex-nowrap gap-2">
            <div class="w-full md:w-1/4 flex flex-col grow gap-1">
              <label for="value" class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:value')}</label>
              <div class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm border border-white group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="value" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="value">
              </div>
            </div>
            <div class="w-1/3 md:w-1/4 flex flex-col grow gap-1">
              <label for="from" class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:from')}</label>
              <div class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <select autocomplete="off" id="from" class="grow rounded-md py-1 px-2 w-full text-lg focus:outline-none bg-transparent" data-var="from">
                </select>
              </div>
            </div>
            <div class="w-1/3 md:w-1/4 flex flex-col grow gap-1">
              <label for="to" class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:to')}</label>
              <div class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <select autocomplete="off" id="to" class="grow rounded-md py-1 px-2 w-full text-lg focus:outline-none bg-transparent" data-var="to">
                </select>
              </div>
            </div>
            <div class="w-full sm:w-auto flex flex-col gap-1">
              <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
              <button data-var="action" class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm rounded-md py-1 px-2 text-lg bg-cyan-700 focus:outline-none focus:bg-transparent hover:bg-transparent focus:text-cyan-700 hover:text-cyan-700">
                ${Translator.__('ViewUnit:Label:action')}
              </buton>
            </div>
          </div>
          <div class="hidden mt-2" data-var="group-result">
            <div class="block text-sm font-medium leading-6">${Translator.__('ViewUnit:Label:result')}</div>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
                <input type="text" readonly autocomplete="off" id="totalVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="result">
                <div class="pointer-events-none" data-var="unit"></div>
                <button class="hover:text-amber-500 focus-within:text-amber-500" data-var="copy" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div data-var="history">
        </div>
      </div>`)
      .appendTo($content, true)

    this.view.addEventListener('value', ['change', 'keyup'], () => {
      this.view.classList('group-result', (classlist) => { classlist.add('hidden') })
    })

    this.view.addEventListener('action', 'click', () => {
      this.updateResult()
      this.view.get('action').blur()
    })

    this.view.addEventListener('copy', 'click', () => {
      navigator.clipboard.writeText(this.view.get('result').value)
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

    this.view.addEventListener('from', 'change', () => {
      this.renderToList()
    })

    this.renderFromList()
    this.renderToList()
    this.renderHistory()
    this.setDefaultValue()
  }

  renderFromList () {
    ['volume', 'pressure', 'gravity', 'temperature', 'length', 'weight'].forEach((unitType) => {
      const optgroup = new Brique(`<optgroup label="${Translator.__('ViewUnit:UnitType:' + unitType)}" data-var="optgroup"></optgroup>`)
      this.view.append('from', optgroup)
      this.unit.getList(unitType).forEach((unit) => {
        const option = new Brique(`<option value="${unitType}:${unit.code}">${unit.label}</option>`)
        optgroup.append('optgroup', option)
      })
    })
  }

  renderToList () {
    this.view.empty('to')
    const [unitType, fromUnit] = this.view.get('from').value.split(':')
    this.unit.getList(unitType).forEach((unit) => {
      if (unit.code !== fromUnit) {
        const option = new Brique(`<option value="${unitType}:${unit.code}">${unit.label}</option>`)
        this.view.append('to', option)
      }
    })
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
      this.view.get('value').value = lastHistory.values[0]
      this.view.get('from').value = lastHistory.values[1] + ':' + lastHistory.values[2]
      this.renderToList()
      this.view.get('to').value = lastHistory.values[1] + ':' + lastHistory.values[3]
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
    const [unitType, fromUnit] = this.view.get('from').value.split(':')
    const [, toUnit] = this.view.get('to').value.split(':')
    const unit = this.unit.getUnit(unitType, fromUnit)
    const toUnitLabel = this.unit.getUnit(unitType, toUnit).shortLabel
    const value = parseFloat(this.view.get('value').value)
    const formatedValue = this.round(unit.convert(value)[fromUnit])
    const result = this.round(unit.convert(value)[toUnit])

    this.view.classList('group-result', (classlist) => { classlist.remove('hidden') })
    this.view.empty('result')
    this.view.get('result').value = result
    this.view.get('unit').innerText = toUnitLabel

    const display = `${formatedValue}${unit.shortLabel} → ${result}${toUnitLabel}`

    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      const values = [
        formatedValue,
        unitType,
        fromUnit,
        toUnit
      ]

      const units = [
      ]

      this.history.addRow({
        values,
        units,
        display
      })
    }
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('value').value = historyRow.values[0]
        this.view.get('from').value = historyRow.values[1] + ':' + historyRow.values[2]
        this.renderToList()
        this.view.get('to').value = historyRow.values[1] + ':' + historyRow.values[3]
        this.view.classList('group-result', (classlist) => { classlist.add('hidden') })
      }
    )
  }
}

export default ViewUnit
