'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewClean {
  constructor ($content) {
    this.productList = [
      {
        code: 'san',
        label: Translator.__('ViewClean:San:label'),
        unit: Translator.__('ViewClean:San:unit'),
        rate: {
          min: 1.5,
          max: 2.5
        }
      },
      {
        code: 'oxy',
        label: Translator.__('ViewClean:Oxy:label'),
        unit: Translator.__('ViewClean:Oxy:unit'),
        rate: {
          min: 4,
          max: 4
        }
      },
      {
        code: 'pwb',
        label: Translator.__('ViewClean:Pwb:label'),
        unit: Translator.__('ViewClean:Pwb:unit'),
        rate: {
          min: 5,
          max: 15
        }
      },
      {
        code: 'wash',
        label: Translator.__('ViewClean:Wash:label'),
        unit: Translator.__('ViewClean:Wash:unit'),
        rate: {
          min: 7,
          max: 21
        }
      },
      {
        code: 'cip',
        label: Translator.__('ViewClean:Cip:label'),
        unit: Translator.__('ViewClean:Cip:unit'),
        rate: {
          min: 2.5,
          max: 4
        }
      },
      {
        code: 'acid',
        label: Translator.__('ViewClean:Cip:label'),
        unit: Translator.__('ViewClean:Cip:unit'),
        rate: {
          min: 10,
          max: 10
        }
      }
    ]

    this.history = new History('ViewClean')

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType) => {
      this.productList.forEach((product) => {
        this.updateResult(product, 'staged')
      })
    })

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2" data-var="form">
          <div>
            <label for="san" class="block text-sm font-medium leading-6">${Translator.__('ViewClean:San:label')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="san" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="sanEntry">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="sanResult">
              </div>
            </div>
          </div>
          <div>
            <label for="pwb" class="block text-sm font-medium leading-6">${Translator.__('ViewClean:Pwb:label')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="pwb" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="pwbEntry">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="pwbResult">
              </div>
            </div>
          </div>
          <div>
            <label for="oxy" class="block text-sm font-medium leading-6">${Translator.__('ViewClean:Oxy:label')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="oxy" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="oxyEntry">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="oxyResult">
              </div>
            </div>
          </div>
          <div>
            <label for="wash" class="block text-sm font-medium leading-6">${Translator.__('ViewClean:Wash:label')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="wash" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="washEntry">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="washResult">
              </div>
            </div>
          </div>
          <div>
            <label for="cip" class="block text-sm font-medium leading-6">${Translator.__('ViewClean:Cip:label')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="cip" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="cipEntry">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="cipResult">
              </div>
            </div>
          </div>
          <div>
            <label for="acid" class="block text-sm font-medium leading-6">${Translator.__('ViewClean:Acid:label')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="acid" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="acidEntry">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="acidResult">
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content, true)

    this.productList.forEach((product) => {
      this.view.addEventListener(`${product.code}Entry`, ['keyup', 'change'], (e) => {
        this.updateResult(product, e.type === 'change' ? 'final' : 'staged')
      })
    })

    this.renderHistory()
    this.setDefaultValue()
  }

  setDefaultValue () {
    this.productList.forEach((product) => {
      const lastHistory = this.getLastHistory(product.code)
      if (lastHistory) {
        this.view.get(`${product.code}Entry`).value = lastHistory.value
        this.updateResult(product)
      }
    })
  }

  getLastHistory (productCode) {
    for (const history of this.history.get()) {
      if (history.productCode === productCode) {
        return history
      }
    }

    return null
  }

  cleanLastStagedHistory (productCode) {
    const historyList = this.history.get()
    for (const historyKey in historyList) {
      const history = historyList[historyKey]
      if (history.productCode === productCode) {
        if (history.status === 'staged') {
          this.history.removeRow(historyKey)
        }
        return
      }
    }
  }

  updateResult (product, status) {
    const volume = this.unit.get('volume')
    let value = parseFloat(this.view.get(`${product.code}Entry`).value)

    if (isNaN(value)) {
      value = 0.0
    }

    const minResult = this.round(volume.convert(value).L * product.rate.min)
    const maxResult = this.round(volume.convert(value).L * product.rate.max)

    this.view.forEach('volumeUnit', $unit => { $unit.innerText = volume.shortLabel })

    this.view
      .empty(`${product.code}Result`)
      .append(`${product.code}Result`, new Brique(`<div class="bg-cyan-950 rounded-md p-2">${minResult} ${product.unit}</div>`))

    if (product.rate.min !== product.rate.max) {
      this.view.append(`${product.code}Result`, new Brique(`<div class="bg-cyan-950 rounded-md p-2">${maxResult} ${product.unit}</div>`))
    }

    if (value !== 0 && typeof status !== 'undefined') {
      const lastHistory = this.getLastHistory(product.code)
      this.cleanLastStagedHistory(product.code)

      if (!lastHistory || lastHistory.status === 'staged' || lastHistory.value.toString() !== value.toString() || lastHistory.unit.toString() !== volume.code.toString()) {
        this.history.addRow({
          value,
          productCode: product.code,
          status,
          unit: volume.code,
          display: minResult === maxResult ? `[${product.label}] ${value}${volume.shortLabel} => ${minResult}${product.unit}` : `[${product.label}] ${value}${volume.shortLabel} => ${minResult}${product.unit} - ${maxResult}${product.unit}`
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
        let product
        for (product of this.productList) {
          if (product.code === historyRow.code) {
            break
          }
        }
        this.unit.set('volume', historyRow.unit)
        this.view.get(`${historyRow.productCode}Entry`).value = historyRow.value
        this.updateResult(product)
      }
    )
  }

  getContent () {
    return this.layout.get('content')
  }
}

export default ViewClean
