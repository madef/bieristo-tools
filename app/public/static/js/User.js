'use strict'

class User {
  constructor () {
    this.brewList = []
    this.brew = {
      id: localStorage.getItem('brew_id'), // eslint-disable-line no-undef
      name: localStorage.getItem('brew_name') // eslint-disable-line no-undef
    }
    this.isLogged = false

    this.load()
  }

  static getInstance () {
    if (typeof User.instance === 'undefined') {
      User.instance = new User()
    }

    return User.instance
  }

  load () {
    if (localStorage.getItem('app_token') !== null) { // eslint-disable-line no-undef
      // @TODO
    }
  }

  push () {
    // @TODO
  }

  isLogged () {
    return this.isLogged
  }

  logout () {
    localStorage.clear() // eslint-disable-line no-undef
    this.isLogged = false
  }

  setStatusObserver (callback) {
    this.statusObserver = callback
  }
}

export default User
