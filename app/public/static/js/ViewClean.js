'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewClean {
  constructor ($content, subview) {
    switch (subview) {
      case 'OXY':
        this.product = {
          code: 'oxy',
          label: Translator.__('ViewClean:Oxy:label'),
          unit: Translator.__('ViewClean:Oxy:unit'),
          rate: {
            min: 4,
            max: 4
          }
        }
        break
      case 'PBW':
        this.product = {
          code: 'pbw',
          label: Translator.__('ViewClean:Pbw:label'),
          unit: Translator.__('ViewClean:Pbw:unit'),
          rate: {
            min: 5,
            max: 15
          }
        }
        break
      case 'WASH':
        this.product = {
          code: 'wash',
          label: Translator.__('ViewClean:Wash:label'),
          unit: Translator.__('ViewClean:Wash:unit'),
          rate: {
            min: 7,
            max: 21
          }
        }
        break
      case 'CIP':
        this.product = {
          code: 'cip',
          label: Translator.__('ViewClean:Cip:label'),
          unit: Translator.__('ViewClean:Cip:unit'),
          rate: {
            min: 2.5,
            max: 4
          }
        }
        break
      case 'ACID':
        this.product = {
          code: 'acid',
          label: Translator.__('ViewClean:Acid:label'),
          unit: Translator.__('ViewClean:Acid:unit'),
          rate: {
            min: 10,
            max: 10
          }
        }
        break
      default:
        this.product = {
          code: 'san',
          label: Translator.__('ViewClean:San:label'),
          unit: Translator.__('ViewClean:San:unit'),
          rate: {
            min: 1.5,
            max: 2.5
          }
        }
        break
    }

    this.history = new History(`ViewClean:${this.product.code}`)

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType, oldUnitCode) => {
      switch (unitType) {
        case 'volume':
          this.convert('productEntry', 'volume', oldUnitCode)
          this.view.forEach('volumeUnit', $unit => { $unit.innerText = this.unit.get('volume').shortLabel })

          this.view.empty('productResult')
          break
      }
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="p-2 flex flex-wrap gap-2">
          <div class="w-full sm:w-2/3 flex flex-col gap-1">
            <label for="product" class="block text-sm font-medium leading-6">${this.product.label}</label>
            <div class="relative rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="product" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="productEntry">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div class="w-full sm:w-auto flex flex-col gap-1">
            <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
            <button data-var="action" class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm rounded-md py-1 px-2 text-lg bg-cyan-700 focus:outline-none focus:bg-transparent hover:bg-transparent focus:text-cyan-700 hover:text-cyan-700">
              ${Translator.__('Generic:Action:calculate')}
            </buton>
          </div>
          <div class="flex items-center w-full sm:w-2/3 gap-2 overflow-x-auto" data-var="productResult">
          </div>
        </div>
        <div data-var="history">
        </div>
      </div>`)
      .appendTo($content, true)

    this.view.addEventListener('action', 'click', (e) => {
      this.updateResult()
      this.view.get('action').blur()
    })

    this.view.addEventListener('productEntry', ['keyup', 'change'], (e) => {
      this.view.empty('productResult')
    })

    this.renderHistory()
    this.setDefaultValue()
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
      this.unit.set('volume', lastHistory.unit)
      this.view.get('productEntry').value = lastHistory.value
      this.updateResult()
    }
  }

  getLastHistory (productCode) {
    const history = this.history.get()

    if (history.length) {
      return history[0]
    }

    return null
  }

  updateResult () {
    const volume = this.unit.get('volume')
    let value = parseFloat(this.view.get('productEntry').value)

    if (isNaN(value)) {
      value = 0.0
    }

    const minResult = this.round(volume.convert(value).L * this.product.rate.min)
    const maxResult = this.round(volume.convert(value).L * this.product.rate.max)

    this.view.empty('productResult')
    this.view.append(
      'productResult',
      new Brique(`<div class="w-full w-1/2 flex flex-col gap-2">
  <label for="from" class="block text-sm font-medium leading-6">${Translator.__(this.product.rate.min !== this.product.rate.max ? 'ViewClean:From:label' : 'ViewClean:Result:label')}</label>
  <div class="flex grow w-full items-center bg-cyan-950 rounded-md gap-1 pr-2">
    <input type="text" readonly autocomplete="off" id="from" data-var="from" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" value="${minResult}">
    <div class="pointer-events-none">${this.product.unit}</div>
    <button class="hover:text-amber-500" data-var="copy" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
      </svg>
    </button>
  </div>
</div>`)
        .addEventListener('copy', 'click', () => {
          navigator.clipboard.writeText(this.view.get('from').value)
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
    )

    if (this.product.rate.min !== this.product.rate.max) {
      this.view.append(
        'productResult',
        new Brique(`<div class="w-full w-1/2 flex flex-col gap-2">
  <label for="to" class="block text-sm font-medium leading-6">${Translator.__('ViewClean:To:label')}</label>
  <div class="flex grow w-full items-center bg-cyan-950 rounded-md gap-1 pr-2">
    <input type="text" readonly autocomplete="off" data-var="to" id="to" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" value="${maxResult}">
    <div class="pointer-events-none">${this.product.unit}</div>
    <button class="hover:text-amber-500" data-var="copy" title="${Translator.__('Generic:Action:copy')}" aria-label="${Translator.__('Generic:Action:copy')}">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
      </svg>
    </button>
  </div>
</div>`)
          .addEventListener('copy', 'click', () => {
            navigator.clipboard.writeText(this.view.get('to').value)
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
          }))
    }

    const display = minResult === maxResult ? `${value}${volume.shortLabel} → ${minResult}${this.product.unit}` : `${value}${volume.shortLabel} → ${minResult}${this.product.unit} - ${maxResult}${this.product.unit}`

    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      this.history.addRow({
        value,
        unit: volume.code,
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
        this.unit.set('volume', historyRow.unit)
        this.view.get('productEntry').value = historyRow.value
      }
    )
  }

  convert (input, unitType, oldUnitCode) {
    const unit = this.unit.get(unitType)
    const value = parseFloat(this.view.get(input).value)

    if (isNaN(value)) {
      return
    }

    this.view.get(input).value = this.round(unit.unconvert(value)[oldUnitCode])
  }
}

export default ViewClean
