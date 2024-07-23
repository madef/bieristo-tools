'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import Confirm from './Confirm.js'

class ViewVolume {
  constructor ($content, getUnit, setUnit, getHistory, addHistory, removeHistory) {
    this.getUnit = getUnit
    this.setUnit = setUnit
    this.getHistory = getHistory
    this.removeHistory = removeHistory
    this.addHistory = addHistory

    this.view = new Brique(
      `<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2">
          <div>
            <label for="bottomHeight" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:bottomHeight')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="bottomHeight" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="bottomHeight">
                <div class="pointer-events-none" data-var="lengthUnit">${this.getUnit('length').shortLabel}</div>
              </div>
              <div class="flex w-full md:w-1/3 items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="tankVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="bottomVolume">
                <div class="pointer-events-none" data-var="volumeUnit">${this.getUnit('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="tankHeight" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:tankHeight')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex flex-wrap md:flex-nowrap gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="tankHeight" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="tankHeight">
                <div class="pointer-events-none" data-var="lengthUnit">${this.getUnit('length').shortLabel}</div>
              </div>
              <div class="flex w-full md:w-1/3 items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="tankVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="tankVolume">
                <div class="pointer-events-none" data-var="volumeUnit">${this.getUnit('volume').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="diameter" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:diameter')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="diameter" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="diameter">
                <div class="pointer-events-none" data-var="lengthUnit">${this.getUnit('length').shortLabel}</div>
              </div>
            </div>
          </div>
          <div>
            <label for="totalVolume" class="block text-sm font-medium leading-6">${Translator.__('ViewVolume:Label:totalVolume')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-full md:w-1/2 items-center gap-2 rounded-md bg-cyan-950 pr-2 group hover:bg-amber-500 focus-within:bg-amber-500">
                <input type="text" readonly autocomplete="off" id="totalVolume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="totalVolume">
                <div class="pointer-events-none" data-var="volumeUnit">${this.getUnit('volume').shortLabel}</div>
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`
    ).appendTo($content)

    this.setDefaultValue();

    document.addEventListener('unitChange', (e) => {
      if (e.unit === 'volume' || e.unit === 'length') {
        this.updateResult('staged')
      }
    });

    ['bottomHeight', 'tankHeight', 'diameter'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], (e) => {
        this.updateResult(e.type === 'change' ? 'final' : 'staged')
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
    const history = this.getHistory()

    if (history.length) {
      return history[0]
    }

    return null
  }

  cleanLastStagedHistory () {
    const historyList = this.getHistory()
    if (historyList.length) {
      const history = historyList[0]
      if (history.status === 'staged') {
        this.removeHistory(0)
      }
    }
  }

  updateResult (status) {
    let bottomHeight = parseFloat(this.view.get('bottomHeight').value)
    let tankHeight = parseFloat(this.view.get('tankHeight').value)
    let diameter = parseFloat(this.view.get('diameter').value)
    const length = this.getUnit('length')
    const volume = this.getUnit('volume')

    this.view.forEach('volumeUnit', $unit => $unit.innerText = volume.shortLabel );
    this.view.forEach('lengthUnit', $unit =>  $unit.innerText = length.shortLabel );

    if (isNaN(diameter)) {
      this.view.get('diameter').value = '0'
      diameter = 0.0
    }

    if (isNaN(bottomHeight)) {
      this.view.get('bottomHeight').value = '0'
      bottomHeight = 0.0
    }

    if (isNaN(tankHeight)) {
      this.view.get('tankHeight').value = '0'
      tankHeight = 0.0
    }

    const calculVolume = (height) => {
      return this.round(volume.unconvert(Math.PI * Math.pow(length.convert(diameter).cm / 2, 2) * length.convert(height).cm / 1000).L)
    }

    const total = this.round(calculVolume(bottomHeight) + calculVolume(tankHeight))

    this.view.get('bottomVolume').value = calculVolume(bottomHeight)
    this.view.get('tankVolume').value = calculVolume(tankHeight)
    this.view.get('totalVolume').value = this.round(total)

    if (total !== 0 && typeof status !== 'undefined') {
      const lastHistory = this.getLastHistory()
      this.cleanLastStagedHistory()

      const values = [
        bottomHeight,
        tankHeight,
        diameter
      ]

      const units = [
        length.code,
        volume.code
      ]

      if (!lastHistory || lastHistory.status === 'staged' || lastHistory.values !== values || lastHistory.units !== units) {
        this.addHistory({
          values,
          units,
          status,
          display: `${diameter}${length.shortLabel}  ⌀ x (${bottomHeight} + ${tankHeight}) = ${total} ${volume.shortLabel}`
        })
        this.renderHistory()
      }
    }
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  renderHistory () {
    this.view.empty('history')

    this.getHistory().forEach((history, key) => {
      const historyLine = new Brique(`<li class="flex flex-wrap odd:bg-box even:bg-zinc-800 p-4 justify-center md:justify-between items-center gap-2">
          <div class="grow w-full md:w-auto text-center md:text-left">${history.display}</div>
          <button class="bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex items-center p-2" data-var="copy">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
            ${Translator.__('Generic:Action:copy')}
          </button>
          <button class="bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded flex items-center p-2" data-var="remove">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
            ${Translator.__('Generic:Action:remove')}
          </button>
        </li>`)
        .addEventListener('remove', 'click', () => {
          new Confirm() // eslint-disable-line no-new
          // this.removeHistory(key)
          // this.renderHistory()
        })
        .addEventListener('copy', 'click', () => {
          this.view.get('bottomHeight').value = history.values[0]
          this.view.get('tankHeight').value = history.values[1]
          this.view.get('diameter').value = history.values[2]
          this.setUnit('length', history.units[0])
          this.setUnit('volume', history.units[1])
          this.updateResult()
        })
      this.view.append('history', historyLine)
    })
  }

  getContent () {
    return this.layout.get('content')
  }
}

export default ViewVolume
