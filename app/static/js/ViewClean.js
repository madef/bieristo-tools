'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

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
    this.unit.addChangeObserver('view', (unitType) => {
      this.updateResult()
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div>
          <label for="product" class="block text-sm font-medium leading-6">${this.product.label}</label>
          <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
            <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
              <input type="number" autocomplete="off" id="product" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="productEntry">
              <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
            </div>
            <div class="flex items-center w-full md:w-1/2 gap-2 overflow-x-auto" data-var="productResult">
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true)

    this.view.addEventListener('productEntry', 'keyup', (e) => {
      this.updateResult()
    })

    this.renderHistory()
    this.setDefaultValue()
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
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

    this.view.forEach('volumeUnit', $unit => { $unit.innerText = volume.shortLabel })

    this.view.empty('productResult')
    this.view.append(
      'productResult',
      new Brique(`<div class="bg-cyan-950 rounded-md p-2 flex gap-2 w-full md:w-auto">
  <div class="grow">${minResult}</div>
  <div>${this.product.unit}</div>
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

    if (this.product.rate.min !== this.product.rate.max) {
      this.view.append(
        'productResult',
        new Brique(`<div class="bg-cyan-950 rounded-md p-2 flex gap-2 w-full md:w-auto">
  <div class="grow">${maxResult}</div>
  <div>${this.product.unit}</div>
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
    }

    const addToHistory = () => {
      const display = minResult === maxResult ? `${value}${volume.shortLabel} => ${minResult}${this.product.unit}` : `${value}${volume.shortLabel} => ${minResult}${this.product.unit} - ${maxResult}${this.product.unit}`

      if (!this.getLastHistory() || this.getLastHistory().display !== display) {
        this.history.addRow({
          value,
          unit: volume.code,
          display
        })
      }
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
        this.updateResult()
      }
    )
  }
}

export default ViewClean
