'use strict'

import Api from './Api.js'
import Confirm from './Confirm.js'
import Translator from './Translator.js'

class User {
  constructor () {
    this.isLogged = false

    this.load(true, '')
    setInterval(() => { this.renewToken() }, 60000)
    setInterval(() => { this.load(false, '', true) }, 30000)
  }

  static getInstance () {
    if (typeof User.instance === 'undefined') {
      User.instance = new User()
    }

    return User.instance
  }

  update (attribute) {
    this.load(true, attribute)
  }

  load (push = false, updatedAttribute = '', removeLocal = false) {
    if (localStorage.getItem('token') !== null) { // eslint-disable-line no-undef
      Api.send('check-token', { token: localStorage.getItem('token') }, result => { // eslint-disable-line no-undef
        if (result.status === 'ERROR') {
          localStorage.removeItem('token') // eslint-disable-line no-undef
        } else {
          this.isLogged = true
          this.dispatchStatusChanged()
        }

        if (result.status === 'ERROR') {
          new Confirm( // eslint-disable-line no-new
            () => {
            },
            Translator.__(result.message),
            [
              {
                label: Translator.__('Generic:ok'),
                classes: ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto', 'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'],
                value: 0
              }
            ]
          )
          return
        }

        Api.send('get-user', { token: localStorage.getItem('token') }, result => { // eslint-disable-line no-undef
          if (result.status === 'OK') {
            const data = this.getData()
            const mergedAttributes = [...Object.keys(result.data), ...Object.keys(data)]
            const attributes = [...new Set(mergedAttributes)]
            let hasMissingData = false
            let hasDistMissingData = false
            const mergedData = {}
            for (const attribute of attributes) {
              if (typeof data[attribute] === 'undefined') {
                if (updatedAttribute !== attribute) {
                  hasMissingData = true
                  if (attribute.indexOf('history') === 0) { // History entry
                    mergedData[attribute] = JSON.parse(result.data[attribute])
                  } else {
                    mergedData[attribute] = result.data[attribute]
                  }
                }
              } else if (typeof result.data[attribute] === 'undefined') {
                hasDistMissingData = true
                if (attribute.indexOf('history') === 0) { // History entry
                  if (!removeLocal) {
                    mergedData[attribute] = JSON.parse(data[attribute])
                  }
                } else {
                  mergedData[attribute] = data[attribute]
                }
              } else if (result.data[attribute] !== data[attribute]) {
                if (attribute.indexOf('history') === 0) { // History entry
                  if (updatedAttribute === attribute) {
                    hasDistMissingData = true
                    mergedData[attribute] = JSON.parse(data[attribute])
                  } else {
                    hasMissingData = true
                    hasDistMissingData = true
                    if (removeLocal) {
                      mergedData[attribute] = JSON.parse(result.data[attribute])
                    } else {
                      mergedData[attribute] = JSON.parse(data[attribute])
                      const localHistory = JSON.parse(data[attribute])
                      const distHistory = JSON.parse(result.data[attribute])
                      const mergedHistory = [...localHistory, ...distHistory]
                      mergedHistory.sort((a, b) => {
                        if (a.date < b.date) {
                          return -1
                        }

                        if (a.date > b.date) {
                          return 1
                        }

                        return 0
                      })

                      mergedData[attribute] = mergedHistory.filter((value, index) => {
                        // On filtre les éléments qui n'ont pas d'autres éléments avec la même date
                        // findLastIndex recherche dans mergedHistory la dernière entrée avec la même date
                        // On garde l'élément si les index sont indentiques
                        return index === mergedHistory.findLastIndex((item) => item.date === mergedHistory[index].date)
                      })
                    }
                  }
                } else {
                  if (updatedAttribute !== attribute) {
                    hasMissingData = true
                    mergedData[attribute] = result.data[attribute]
                  } else {
                    hasDistMissingData = true
                    mergedData[attribute] = data[attribute]
                  }
                }
              } else {
                if (attribute.indexOf('history') === 0) { // History entry
                  mergedData[attribute] = JSON.parse(data[attribute])
                } else {
                  mergedData[attribute] = data[attribute]
                }
              }

              if (typeof mergedData[attribute] === 'undefined') {
                sessionStorage.removeItem(attribute) // eslint-disable-line no-undef
              } else {
                if (attribute.indexOf('history') === 0) { // History entry
                  sessionStorage.setItem(attribute, JSON.stringify(mergedData[attribute])) // eslint-disable-line no-undef
                } else {
                  sessionStorage.setItem(attribute, mergedData[attribute]) // eslint-disable-line no-undef
                }
              }
            }

            if (hasDistMissingData) {
              this.push()
            }
            if (hasMissingData) {
              this.dispatchDataChanged()
            }
          }
        })
      })
    }
  }

  push () {
    Api.send('update-user', { token: localStorage.getItem('token'), data: this.getData() }, result => { // eslint-disable-line no-undef
      if (result.status === 'ERROR') {
        new Confirm( // eslint-disable-line no-new
          () => {
          },
          Translator.__(result.message),
          [
            {
              label: Translator.__('Generic:ok'),
              classes: ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto', 'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'],
              value: 0
            }
          ]
        )
      }
    })
  }

  getData () {
    const data = JSON.parse(JSON.stringify(sessionStorage)) // eslint-disable-line no-undef
    delete data.token
    delete data.lastCheckToken
    delete data.view
    delete data.subview
    return data
  }

  renewToken () {
    if (localStorage.getItem('token') !== null && this.isTokenInvalidated()) { // eslint-disable-line no-undef
      Api.send('renew-token', { token: localStorage.getItem('token') }, result => { // eslint-disable-line no-undef
        if (result.status === 'ERROR') {
          localStorage.removeItem('token') // eslint-disable-line no-undef
          this.isLogged = false
          this.dispatchStatusChanged()
          new Confirm( // eslint-disable-line no-new
            () => {
            },
            Translator.__(result.message),
            [
              {
                label: Translator.__('Generic:ok'),
                classes: ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto', 'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'],
                value: 0
              }
            ]
          )
        } else {
          localStorage.setItem('token', result.token) // eslint-disable-line no-undef
          localStorage.setItem('lastCheckToken', new Date().toISOString()) // eslint-disable-line no-undef
        }
      })
    }
  }

  isTokenChecked () {
    const lastCheckToken = localStorage.getItem('lastCheckToken') // eslint-disable-line no-undef
    return !!lastCheckToken
  }

  isTokenInvalidated () {
    const lastCheckToken = localStorage.getItem('lastCheckToken') // eslint-disable-line no-undef
    if (!lastCheckToken) {
      return true
    }

    const lastCheckTokenDate = new Date(lastCheckToken)
    const currentDate = new Date()
    const diffInMinutes = (currentDate - lastCheckTokenDate) / 1000 / 60

    if (diffInMinutes > 60 * 12) {
      return true
    } else {
      return false
    }
  }

  logout () {
    sessionStorage.clear() // eslint-disable-line no-undef
    this.isLogged = false
  }

  setStatusObserver (callback) {
    this.statusObserver = callback
  }

  dispatchStatusChanged () {
    if (typeof this.statusObserver === 'function') {
      this.statusObserver()
    }
  }

  setDataChangedObserver (callback) {
    this.dataChangedObserver = callback
  }

  dispatchDataChanged () {
    if (typeof this.dataChangedObserver() === 'function') {
      this.dataChangedObserver()
    }
  }
}

export default User
