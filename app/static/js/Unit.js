'use strict'

import InvalidUnitIdentifier from './Exception/InvalidUnitIdentifier.js'
import Translator from './Translator.js'
import InvalidUnitCode from './Exception/InvalidUnitCode.js'

class Unit {
  constructor () {
    this.changeCallback = {}
  }

  static getInstance () {
    if (typeof Unit.instance === 'undefined') {
      Unit.instance = new Unit()
    }

    return Unit.instance
  }

  addChangeObserver (type, callback) {
    this.changeCallback[type] = callback
  }

  get (unitType) {
    const code = localStorage.getItem(`UNIT_${unitType}`) // eslint-disable-line no-undef
    if (code === null) {
      return this.getList(unitType)[0]
    }

    for (const unit of this.getList(unitType)) {
      if (unit.code === code) {
        return unit
      }
    }
  }

  set (unitType, code) {
    for (const unit of this.getList(unitType)) {
      if (unit.code === code) {
        if (this.get(unitType).code !== code) {
          localStorage.setItem(`UNIT_${unitType}`, code) // eslint-disable-line no-undef
          for (const type in this.changeCallback) {
            this.changeCallback[type](unitType)
          }
        }
        return
      }
    }

    throw new InvalidUnitCode(`Invalid unit code ${code} for unit ${unitType}`)
  }

  getList (unitType) {
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
          },
          unconvert: unit => {
            return {
              B: unit,
              PSI: unit / 14.5038
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
          },
          unconvert: unit => {
            return {
              B: unit * 14.5038,
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
          },
          unconvert: unit => {
            return {
              SG: unit,
              P: 1 + (unit / (258.6 - (0.88 * unit))),
              B: 1 + ((unit * 0.96) / (258.6 - (0.88 * unit * 0.96)))
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
          },
          unconvert: unit => {
            return {
              SG: 258.6 * (unit - 1) / (0.12 + 0.88 * unit),
              P: unit,
              B: unit * 0.96
            }
          }
        },
        {
          label: Translator.__('Unit:B'),
          shortLabel: '°Bx',
          code: 'B',
          convert: unit => {
            return {
              SG: 1 + ((unit * 0.96) / (258.6 - (0.88 * unit * 0.96))),
              P: unit * 0.96,
              B: unit
            }
          },
          unconvert: unit => {
            return {
              SG: 258.6 * (unit - 1) / (0.12 + 0.88 * unit) / 0.96,
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

    if (typeof unitList[unitType] === 'undefined') {
      throw new InvalidUnitIdentifier(`Invalid unit identifier ${unitType}`)
    }

    return unitList[unitType]
  }
}

export default Unit
