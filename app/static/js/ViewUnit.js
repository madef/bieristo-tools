'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'

class ViewUnit {
  constructor ($content, getUnit, getHistory, addHistory, removeHistory, clearHistory) {
    this.getUnit = getUnit
    this.getHistory = getHistory
    this.removeHistory = removeHistory
    this.addHistory = addHistory

    this.view = new Brique(`
      <h1>${Translator.__('ViewUnitConversion:title')}</h1>
      <div>
          <input type="number" placeholder="${Translator.__('Pressure:label')}" data-var="pressure" />
          <span data-var="pressureUnit"></span> = <span data-var="pressureResult"></span>
      </div>
      <div>
          <input type="number" placeholder="${Translator.__('Volume:label')}" data-var="volume" />
          <span data-var="volumeUnit"></span> = <span data-var="volumeResult"></span>
      </div>
      <div>
          <input type="number" placeholder="${Translator.__('Gravity:label')}" data-var="gravity" />
          <span data-var="gravityUnit"></span> = <span data-var="gravityResult"></span>
      </div>
      <div>
          <input type="number" placeholder="${Translator.__('Temperature:label')}" data-var="temperature" />
          <span data-var="temperatureUnit"></span> = <span data-var="temperatureResult"></span>
      </div>
      <ul data-var="history">
      </ul>
    `)
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
    const $result = this.view.get(`${type}Result`)

    $result.innerText = ''

    if (isNaN(value)) {
      return
    }

    const unit = this.getUnit(type)
    const convert = unit.convert(value)
    let result = ''
    let history = ''
    switch (type) {
      case 'temperature':
        switch (unit.code) {
          case 'C':
            result = `${this.round(convert.F)}°F`
            break
          case 'F':
            result = `${this.round(convert.C)}°C`
            break
        }

        history = `${value}${unit.shortLabel} = ${result}`
        break
      case 'pressure':
        switch (unit.code) {
          case 'B':
            result = `${this.round(convert.PSI)} PSI`
            break
          case 'PSI':
            result = `${this.round(convert.B)} Bar`
            break
        }

        history = `${value} ${unit.shortLabel} = ${result}`
        break
      case 'volume':
        switch (unit.code) {
          case 'L':
            result = `${this.round(convert.G)} Gal`
            break
          case 'G':
            result = `${this.round(convert.L)} L`
            break
        }

        history = `${value} ${unit.shortLabel} = ${result}`
        break
      case 'gravity':
        switch (unit.code) {
          case 'SG':
            result = `${this.round(convert.P)}°P, ${this.round(convert.B)}°Bx`
            break
          case 'P':
            result = `${this.round(convert.SG, 3)}°SG, ${this.round(convert.B)}°Bx`
            break
          case 'B':
            result = `${this.round(convert.SG, 3)}°SG, ${this.round(convert.P)}°P`
            break
        }

        history = `${value} ${unit.shortLabel} = ${result}`
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

    $result.innerText = `${result}`
    $unit.innerText = `${unit.shortLabel}`
  }

  round (number, precision = 2) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  renderHistory () {
    this.view.empty('history')

    this.getHistory().forEach((history, key) => {
      const historyLine = new Brique(`<li>${history.display}<button data-var="copy">Copie</button><button data-var="remove">Supprimer</button></li>`)
        .addEventListener('remove', 'click', () => {
          this.removeHistory(key)
          this.renderHistory()
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
