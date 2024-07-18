'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import Confirm from './Confirm.js'

class ViewUnit {
  constructor ($content, getUnit, getHistory, addHistory, removeHistory, clearHistory) {
    this.getUnit = getUnit
    this.getHistory = getHistory
    this.removeHistory = removeHistory
    this.addHistory = addHistory

    this.view = new Brique(`<div class="flex flex-col gap-4">
        <div class="grid md:grid-cols-2 gap-2">
          <div>
            <label for="pressure" class="block text-sm font-medium leading-6">${Translator.__('ViewUnitConversion:Label:pressure')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="pressure" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="pressure">
                <div class="pointer-events-none" data-var="pressureUnit">${this.getUnit('pressure').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="pressureResult">
              </div>
            </div>
          </div>
          <div>
            <label for="volume" class="block text-sm font-medium leading-6">${Translator.__('ViewUnitConversion:Label:volume')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="volume" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="volume">
                <div class="pointer-events-none" data-var="volumeUnit">${this.getUnit('volume').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="volumeResult">
                <div class="bg-cyan-950 rounded-md p-2">
                  89 gal
                </div>
                <div class="bg-cyan-950 rounded-md p-2">
                  89 Gal
                </div>
              </div>
            </div>
          </div>
          <div>
            <label for="gravity" class="block text-sm font-medium leading-6">${Translator.__('ViewUnitConversion:Label:gravity')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="gravity" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="gravity">
                <div class="pointer-events-none" data-var="gravityUnit">${this.getUnit('gravity').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="gravityResult">
                <div class="bg-cyan-950 rounded-md p-2">
                  89 gal
                </div>
                <div class="bg-cyan-950 rounded-md p-2">
                  89 Gal
                </div>
              </div>
            </div>
          </div>
          <div>
            <label for="temperature" class="block text-sm font-medium leading-6">${Translator.__('ViewUnitConversion:Label:temperature')}</label>
            <div class="relative mt-2 rounded-md shadow-sm flex gap-2">
              <div class="flex w-1/2 items-center gap-2 rounded-md border border-white pr-2 group hover:border-amber-500 focus-within:border-amber-500">
                <input type="number" autocomplete="off" id="temperature" class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none" data-var="temperature">
                <div class="pointer-events-none" data-var="temperatureUnit">${this.getUnit('temperature').shortLabel}</div>
              </div>
              <div class="flex items-center w-1/2 gap-2 overflow-x-auto" data-var="temperatureResult">
                <div class="bg-cyan-950 rounded-md p-2">
                  89 gal
                </div>
                <div class="bg-cyan-950 rounded-md p-2">
                  89 Gal
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul data-var="history" class="border border-zinc-700 rounded">
        </ul>
      </div>`)
      .appendTo($content)

    this.setDefaultValue()

    document.addEventListener('unitChange', () => {
      ['temperature', 'pressure', 'volume', 'gravity'].forEach((type) => {
        this.updateResult(type)
      })
    });

    ['temperature', 'pressure', 'volume', 'gravity'].forEach((type) => {
      this.view.addEventListener(type, ['keyup', 'change'], (e) => {
        this.updateResult(type, e.type === 'change' ? 'final' : 'staged')
      })
    })

    this.renderHistory()
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
    for (const history of this.getHistory()) {
      if (history.type === type) {
        return history
      }
    }

    return null
  }

  cleanLastStagedHistory (type) {
    const historyList = this.getHistory()
    for (const historyKey in historyList) {
      const history = historyList[historyKey]
      if (history.type === type) {
        if (history.status === 'staged') {
          this.removeHistory(historyKey)
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

    const unit = this.getUnit(type)
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
      this.cleanLastStagedHistory(type)

      const lastHistory = this.getLastHistory(type)
      if (!lastHistory || lastHistory.value !== value) {
        this.addHistory({
          type,
          value,
          status,
          display: history
        })
        this.renderHistory()
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
          this.view.get(history.type).value = history.value
          this.updateResult(history.type)
        })
      this.view.append('history', historyLine)
    })
  }

  getContent () {
    return this.layout.get('content')
  }
}

export default ViewUnit
