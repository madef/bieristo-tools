'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'

class ViewVolume {
  constructor ($content) {
    this.history = new History('ViewVolume')

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('view', (unitType) => {
      if (unitType === 'volume' || unitType === 'length') {
        this.updateResult('staged')
      }
    })

    this.view = new Brique(
      `<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2">
          <div>
            <label for="bottomHeight" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:bottomHeight')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="bottomHeight" value="10" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="bottomHeight">
                <div class="pointer-events-none" data-var="lengthUnit">${this.unit.get('length').shortLabel}</div>
              </div>
              <div class="flex w-full md:w-1/3 items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="tankVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="bottomVolume">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="tankHeight" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:tankHeight')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="tankHeight" value="50" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="tankHeight">
                <div class="pointer-events-none" data-var="lengthUnit">${this.unit.get('length').shortLabel}</div>
              </div>
              <div class="flex w-full md:w-1/3 items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="tankVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="tankVolume">
                <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="diameter" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:diameter')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="diameter" value="40" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="diameter">
                <div class="pointer-events-none" data-var="lengthUnit">${this.unit.get('length').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <div class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:totalVolume')}</div>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md bg-cyan-950 py-1 px-2 text-lg" data-var="totalVolume">
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`
    ).appendTo($content, true)

    this.setDefaultValue();

    ['bottomHeight', 'tankHeight', 'diameter'].forEach((type) => {
      this.view.addEventListener(type, 'keyup', () => {
        this.updateResult()
      })
    })

    this.renderHistory()
  }

  setDefaultValue () {
    const lastHistory = this.getLastHistory()
    if (lastHistory) {
      this.view.get('bottomHeight').value = lastHistory.values[0]
      this.view.get('tankHeight').value = lastHistory.values[1]
      this.view.get('diameter').value = lastHistory.values[2]
    }
    this.updateResult()
  }

  getLastHistory () {
    const history = this.history.get()

    if (history.length) {
      return history[0]
    }

    return null
  }

  updateResult () {
    const bottomHeight = parseFloat(this.view.get('bottomHeight').value)
    const tankHeight = parseFloat(this.view.get('tankHeight').value)
    const diameter = parseFloat(this.view.get('diameter').value)
    const length = this.unit.get('length')
    const volume = this.unit.get('volume')

    this.view.forEach('volumeUnit', $unit => { $unit.innerText = volume.shortLabel })
    this.view.forEach('lengthUnit', $unit => { $unit.innerText = length.shortLabel })

    const calculVolume = (height) => {
      return this.round(volume.unconvert(Math.PI * Math.pow(length.convert(diameter).cm / 2, 2) * length.convert(height).cm / 1000).L)
    }

    const total = this.round(calculVolume(bottomHeight) + calculVolume(tankHeight))

    this.view.get('bottomVolume').value = calculVolume(bottomHeight)
    this.view.get('tankVolume').value = calculVolume(tankHeight)

    this.view.empty('totalVolume')
    this.view.append(
      'totalVolume',
      new Brique(`<div class="grow">${this.round(total)}</div>
  <div>${volume.shortLabel}</div>
  <button class="hover:text-amber-500" data-var="history-add" title="${Translator.__('Generic:Action:historyAdd')}" aria-label="${Translator.__('Generic:Action:historyAdd')}">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  </button>
</div>`)
    )
      .addEventListener('history-add', 'click', () => {
        const display = `${diameter}${length.shortLabel}  ⌀ x (${bottomHeight} + ${tankHeight}) = ${total} ${volume.shortLabel}`
        if (!this.getLastHistory() || this.getLastHistory().display !== display) {
          const values = [
            bottomHeight,
            tankHeight,
            diameter
          ]

          const units = [
            length.code,
            volume.code
          ]

          this.history.addRow({
            values,
            units,
            display
          })
        }
      })
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('bottomHeight').value = historyRow.values[0]
        this.view.get('tankHeight').value = historyRow.values[1]
        this.view.get('diameter').value = historyRow.values[2]
        this.unit.set('length', historyRow.units[0])
        this.unit.set('volume', historyRow.units[1])
        this.updateResult()
      }
    )
  }
}

export default ViewVolume
