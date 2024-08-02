'use strict'

class History {
  constructor (type) {
    this.type = type
    this.changeCallback = () => {}
  }

  getStorageKey () {
    return `history_${this.type}`
  }

  get () {
    const storage = localStorage.getItem(this.getStorageKey()) // eslint-disable-line no-undef
    if (storage === null) {
      return []
    } else {
      return JSON.parse(storage).reverse()
    }
  }

  addRow (historyRow) {
    const HISTORY_MAX_LENGTH = 100
    const history = this.get().reverse()
    historyRow.date = new Date()
    history.push(historyRow)

    if (history.length > HISTORY_MAX_LENGTH) {
      history.splice(0, history.length - HISTORY_MAX_LENGTH)
    }

    localStorage.setItem(this.getStorageKey(), JSON.stringify(history)) // eslint-disable-line no-undef

    this.changeCallback()

    return this
  }

  removeRow (historyKey) {
    const history = this.get()
    history.splice(historyKey, 1)
    localStorage.setItem(this.getStorageKey(), JSON.stringify(history.reverse())) // eslint-disable-line no-undef

    this.changeCallback()

    return this
  }

  clear () {
    localStorage.removeItem(this.getStorageKey()) // eslint-disable-line no-undef

    this.changeCallback()

    return this
  }

  setChangeObserver (callback) {
    this.changeCallback = callback
  }
}

export default History
