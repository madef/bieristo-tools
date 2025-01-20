'use strict'

import InvalidUnitIdentifier from './Exception/InvalidUnitIdentifier.js'
import Translator from './Translator.js'
import InvalidUnitCode from './Exception/InvalidUnitCode.js'
import User from './User.js'

class Unit {
  constructor () {
    this.changeCallback = {}
    this.user = User.getInstance()
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

    for (const unit of this.getList(unitType)) {
      if (unit.code === code) {
        return unit
      }
    }

    return this.getList(unitType)[0]
  }

  getUnit (unitType, code) {
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
          const oldCode = this.get(unitType).code
          localStorage.setItem(`UNIT_${unitType}`, code) // eslint-disable-line no-undef
          for (const type in this.changeCallback) {
            this.changeCallback[type](unitType, oldCode)
          }
          this.user.update(`UNIT_${unitType}`)
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
          shortLabel: 'G',
          code: 'SG',
          convert: unit => {
            if (unit > 200) {
              unit = unit / 1000
            } else if (unit > 2) {
              unit = (1000 + unit) / 1000
            }

            return {
              SG: Math.round(unit * 1000),
              P: 258.6 * (unit - 1) / (0.12 + 0.88 * unit),
              B: 258.6 * (unit - 1) / (0.12 + 0.88 * unit) / 0.96
            }
          },
          unconvert: unit => {
            return {
              SG: Math.round(unit),
              P: Math.round(1000 * (1 + unit / (258.6 - (0.88 * unit)))),
              B: Math.round(1000 * (1 + ((unit * 0.96) / (258.6 - (0.88 * unit * 0.96)))))
            }
          }
        },
        {
          label: Translator.__('Unit:P'),
          shortLabel: '°P',
          code: 'P',
          convert: unit => {
            return {
              SG: Math.round(1000 * (1 + (unit / (258.6 - (0.88 * unit))))),
              P: unit,
              B: unit / 0.96
            }
          },
          unconvert: unit => {
            let sgUnit = unit
            if (sgUnit > 200) {
              sgUnit = sgUnit / 1000
            } else if (sgUnit > 2) {
              sgUnit = (1000 + sgUnit) / 1000
            }

            return {
              SG: 258.6 * (sgUnit - 1) / (0.12 + 0.88 * sgUnit),
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
              SG: Math.round(1000 * (1 + ((unit * 0.96) / (258.6 - (0.88 * unit * 0.96))))),
              P: unit * 0.96,
              B: unit
            }
          },
          unconvert: unit => {
            let sgUnit = unit
            if (sgUnit > 200) {
              sgUnit = sgUnit / 1000
            } else if (sgUnit > 2) {
              sgUnit = (1000 + sgUnit) / 1000
            }

            return {
              SG: 258.6 * (sgUnit - 1) / (0.12 + 0.88 * sgUnit) / 0.96,
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
          },
          unconvert: unit => {
            return {
              C: unit,
              F: (unit - 32) * 5 / 9
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
          },
          unconvert: unit => {
            return {
              C: 9 / 5 * unit + 32,
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
          },
          unconvert: unit => {
            return {
              cm: unit,
              I: unit * 2.54
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
          },
          unconvert: unit => {
            return {
              cm: unit / 2.54,
              I: unit
            }
          }
        }
      ],
      weight: [
        {
          label: Translator.__('Unit:g'),
          shortLabel: 'g',
          code: 'g',
          convert: unit => {
            return {
              g: unit,
              lbs: unit * 0.00220462
            }
          },
          unconvert: unit => {
            return {
              g: unit,
              lbs: unit / 0.00220462
            }
          }
        },
        {
          label: Translator.__('Unit:lbs'),
          shortLabel: 'lbs',
          code: 'lbs',
          convert: unit => {
            return {
              g: unit / 0.00220462,
              lbs: unit
            }
          },
          unconvert: unit => {
            return {
              g: unit * 0.00220462,
              lbs: unit
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
