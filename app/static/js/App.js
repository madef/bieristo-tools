'use strict'

import Translator from './Translator.js'
import Layout from './Layout.js'
import LayoutBleuScreenOfDeath from './LayoutBleuScreenOfDeath.js'
import ViewUnit from './ViewUnit.js'
import ViewVolume from './ViewVolume.js'
import InvalidUnitIdentifier from './Exception/InvalidUnitIdentifier.js'
import InvalidUnitCode from './Exception/InvalidUnitCode.js'

class App {
  constructor () {
    const $root = document.getElementById('app')

    Translator.getInstance()
      .load(() => {
        this.layout = new Layout(
          $root,
          () => { return this.getViewList() },
          (view) => { this.setCurrentView(view) },
          (type) => { return this.getUnitList(type) },
          (type) => { return this.getUnit(type) },
          (type, code) => { this.setUnit(type, code) }
        )
        this.$content = this.layout.getContent()
        this.loadCurrentView()

        document.title = Translator.__('AppTitle')
      })
      .catch((e) => {
        new LayoutBleuScreenOfDeath($root, e.message) // eslint-disable-line no-new
        console.error(e)
      })
  }

  setCurrentView (view) {
    localStorage.setItem('currentView', view) // eslint-disable-line no-undef
    this.loadCurrentView()
  }

  getCurrentView () {
    const currentView = localStorage.getItem('currentView') // eslint-disable-line no-undef

    if (!currentView) {
      return this.getViewList()[0].key
    }

    return currentView
  }

  getViewList () {
    return [
      {
        key: 'UNIT',
        label: Translator.__('ViewUnitConversion:shortTitle')
      },
      {
        key: 'ALCOOL',
        label: Translator.__('ViewAlcool:shortTitle')
      },
      {
        key: 'VOLUME',
        label: Translator.__('ViewVolume:shortTitle')
      }
    ]
  }

  loadCurrentView () {
    this.layout.emptyContent()
    switch (this.getCurrentView()) {
      case 'UNIT':
        return new ViewUnit(
          this.$content,
          (type) => { return this.getUnit(type) },
          (type, code) => { return this.setUnit(type, code) },
          () => {
            return this.getViewHistory()
          },
          (historyItem) => {
            this.addViewHistory(historyItem)
          },
          (historyKey) => {
            this.removeViewHistory(historyKey)
          }
        )
      case 'VOLUME':
        return new ViewVolume(
          this.$content,
          (type) => { return this.getUnit(type) },
          (type, code) => { return this.setUnit(type, code) },
          () => {
            return this.getViewHistory()
          },
          (historyItem) => {
            this.addViewHistory(historyItem)
          },
          (historyKey) => {
            this.removeViewHistory(historyKey)
          }
        )
      case 'ALCOOL':
        return new ViewAlcool(
          this.$content,
          () => {
            return this.getViewHistory()
          },
          (historyItem) => {
            this.addViewHistory(historyItem)
          },
          (historyKey) => {
            this.removeViewHistory(historyKey)
          }
        )
      default:
        throw new Error('Unknow view')
    }
  }

  getViewHistory () {
    const storage = localStorage.getItem(this.getCurrentView()) // eslint-disable-line no-undef
    if (storage === null) {
      return []
    } else {
      return JSON.parse(storage).reverse()
    }
  }

  addViewHistory (historyItem) {
    const HISTORY_MAX_LENGTH = 100
    const history = this.getViewHistory().reverse()
    history.push(historyItem)

    if (history.length > HISTORY_MAX_LENGTH) {
      history.splice(0, history.length - HISTORY_MAX_LENGTH)
    }

    localStorage.setItem(this.getCurrentView(), JSON.stringify(history)) // eslint-disable-line no-undef
    return this
  }

  removeViewHistory (historyKey) {
    const history = this.getViewHistory()
    history.splice(historyKey, 1)
    localStorage.setItem(this.getCurrentView(), JSON.stringify(history.reverse())) // eslint-disable-line no-undef
    return this
  }

  clearViewHistory () {
    localStorage.removeItem(this.getCurrentView()) // eslint-disable-line no-undef
    return this
  }

  getUnit (type) {
    const code = localStorage.getItem(`UNIT_${type}`) // eslint-disable-line no-undef
    if (code === null) {
      return this.getUnitList(type)[0]
    }

    for (const unit of this.getUnitList(type)) {
      if (unit.code === code) {
        return unit
      }
    }
  }

  setUnit (type, code) {
    for (const unit of this.getUnitList(type)) {
      if (unit.code === code) {
        localStorage.setItem(`UNIT_${type}`, code) // eslint-disable-line no-undef
        const event = new Event('unitChange', { bubbles: true, cancelable: false })
        event.unit = type
        document.dispatchEvent(event)
        return
      }
    }

    throw new InvalidUnitCode(`Invalid unit code ${code} for unit ${type}`)
  }

  getUnitList (type) {
    const unitList = {
      volume: [
        {
          label: Translator.__('Unit:L'),
          shortLabel: 'L',
          code: 'L',
          convert: unit => {
            return {
              L: unit,
              G: unit * 0.264172
            }
          },
          unconvert: unit => {
            return {
              L: unit,
              G: unit / 0.264172
            }
          }
        },
        {
          label: Translator.__('Unit:GAL'),
          shortLabel: 'gal',
          code: 'G',
          convert: unit => {
            return {
              L: unit / 0.264172,
              G: unit
            }
          },
          unconvert: unit => {
            return {
              L: unit * 0.264172,
              G: unit
            }
          }
        }
      ],
      pressure: [
        {
          label: Translator.__('Unit:BAR'),
          shortLabel: 'bar',
          code: 'B',
          convert: unit => {
            return {
              B: unit,
              PSI: unit * 14.5038
            }
          }
        },
        {
          label: Translator.__('Unit:PSI'),
          shortLabel: 'PSI',
          code: 'PSI',
          convert: unit => {
            return {
              B: unit / 14.5038,
              PSI: unit
            }
          }
        }
      ],
      gravity: [
        {
          label: Translator.__('Unit:SG'),
          shortLabel: 'SG',
          code: 'SG',
          convert: unit => {
            return {
              SG: unit,
              P: 258.6 * (unit - 1) / (0.12 + 0.88 * unit),
              B: 258.6 * (unit - 1) / (0.12 + 0.88 * unit) / 0.96
            }
          }
        },
        {
          label: Translator.__('Unit:P'),
          shortLabel: '°P',
          code: 'P',
          convert: unit => {
            return {
              SG: 1 + (unit / (258.6 - (0.88 * unit))),
              P: unit,
              B: unit / 0.96
            }
          }
        },
        {
          label: Translator.__('Unit:B'),
          shortLabel: '°Bx',
          code: 'B',
          convert: unit => {
            return {
              GS: 1 + ((unit * 0.96) / (258.6 - (0.88 * unit * 0.96))),
              P: unit / 0.96,
              B: unit
            }
          }
        }
      ],
      temperature: [
        {
          label: Translator.__('Unit:C'),
          shortLabel: '°C',
          code: 'C',
          convert: unit => {
            return {
              C: unit,
              F: 9 / 5 * unit + 32
            }
          }
        },
        {
          label: Translator.__('Unit:F'),
          shortLabel: '°F',
          code: 'F',
          convert: unit => {
            return {
              C: (unit - 32) * 5 / 9,
              F: unit
            }
          }
        }
      ],
      length: [
        {
          label: Translator.__('Unit:cm'),
          shortLabel: 'cm',
          code: 'cm',
          convert: unit => {
            return {
              cm: unit,
              I: unit / 2.54
            }
          }
        },
        {
          label: Translator.__('Unit:I'),
          shortLabel: 'po',
          code: 'I',
          convert: unit => {
            return {
              cm: unit * 2.54,
              I: unit
            }
          }
        }
      ]
    }

    if (typeof unitList[type] === 'undefined') {
      throw new InvalidUnitIdentifier(`Invalid unit identifier ${type}`)
    }

    return unitList[type]
  }
}

new App() // eslint-disable-line no-new
