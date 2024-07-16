'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'

class Layout {
  constructor ($root, getViewList, setCurrentView, getUnitList, getUnit, setUnit) {
    this.setCurrentView = setCurrentView
    this.getViewList = getViewList
    this.getUnitList = getUnitList
    this.getUnit = getUnit
    this.setUnit = setUnit

    this.layout = new Brique(`
      <button data-var="menu">${Translator.__('Menu:title')}</button>
      <div class="border border-black" data-var="unitList"></div>
      <div class="border border-black" data-var="content"></div>
    `)
    this.layout.appendTo($root)
    this.renderUnitList($root)

    this.layout.addEventListener('menu', 'click', () => this.openMenu($root))
  }

  openMenu ($root) {
    const menu = new Brique('<div data-var="menu"><button data-var="close">X</button></div>')
    menu.appendTo($root)

    const closeMenu = () => {
      menu.remove()
    }

    menu.addEventListener('close', 'click', closeMenu)

    this.getViewList().forEach((view) => {
      const button = new Brique(`<button data-var="${view.key}">${view.label}</button>`)
        .addEventListener(view.key, 'click', () => {
          this.setCurrentView(view.key)
          closeMenu()
        })
      menu.append('menu', button)
    })
  }

  renderUnitList ($root) {
    this.layout.empty('unitList');

    ['volume', 'pressure', 'gravity', 'temperature', 'length'].forEach((type) => {
      const unit = this.getUnit(type)
      const button = new Brique(`<button data-var="action">${unit.shortLabel}</button>`)
        .addEventListener('action', 'click', () => {
          this.openUnitMenu($root, type)
        })
      this.layout.append('unitList', button)
    })
  }

  openUnitMenu ($root, type) {
    const menu = new Brique('<div data-var="menu"><button data-var="close">X</button></div>')
    menu.appendTo($root)

    const closeMenu = () => {
      menu.remove()
    }

    menu.addEventListener('close', 'click', closeMenu)

    this.getUnitList(type).forEach((value) => {
      const button = new Brique(`<button data-var="action">${value.label}</button>`)
        .addEventListener('action', 'click', () => {
          this.setUnit(type, value.code)
          closeMenu()
          this.renderUnitList($root)
        })
      menu.append('menu', button)
    })
  }

  getContent () {
    return this.layout.get('content')
  }

  emptyContent () {
    this.layout.empty('content')
  }
}

export default Layout
