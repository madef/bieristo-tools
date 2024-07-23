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
      <div class="absolute inset-0 bg-main text-white overflow-y-auto">
        <div class="rounded flex justify-between items-center mb-2 md:mb-6 gap-2 p-2 bg-main sticky top-0 z-10">
          <button class="flex flex-col justify-center items-center text-xs hover:text-amber-500 focus:text-amber-500" data-var="menu" aria-label="${Translator.__('Menu:title')}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 md:size-12">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
            <span class="hidden md:block">${Translator.__('Menu:title')}</span>
          </button>
          <div class="flex gap-2 overflow-x-auto" data-var="unitList"></div>
        </div>
        <div class="p-2" data-var="content"></div>
      </div>
    `)
    this.layout.appendTo($root)
    this.renderUnitList($root)

    document.addEventListener('unitChange', () => { this.renderUnitList($root) })
    this.layout.addEventListener('menu', 'click', () => this.openMenu($root))
  }

  openMenu ($root) {
    const menu = new Brique(`<div class="absolute inset-0 text-white overflow-y-auto p-2 flex flex-col items-center bg-black/80 backdrop-blur-sm z-10" data-var="overlay">
      <div class="flex flex-col items-center gap-2" data-var="menu">
        <button class="bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded p-2 w-full text-xl flex gap-2 items-center justify-center h-12" data-var="close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          ${Translator.__('Menu:close')}
        </button>
      </div>
    </div>`)
    menu.appendTo($root)

    const closeMenu = () => {
      menu.remove()
    }

    menu.addEventListener('close', 'click', closeMenu)
    menu.addEventListener('overlay', 'click', closeMenu)

    this.getViewList().forEach((view) => {
      const button = new Brique(`<button class="bg-amber-500 hover:bg-transparent hover:text-amber-500 focus:bg-transparent focus:text-amber-500 rounded p-2 w-full text-xl h-12" data-var="${view.key}">${view.label}</button>`)
        .addEventListener(view.key, 'click', () => {
          this.setCurrentView(view.key)
          closeMenu()
        })
      menu.append('menu', button)
    })
  }

  renderUnitList ($root) {
    this.layout.empty('unitList');

    ['pressure', 'gravity', 'volume', 'temperature', 'length'].forEach((type) => {
      const unit = this.getUnit(type)
      const button = new Brique(`<button
          class="bg-amber-500 hover:bg-transparent hover:text-amber-500 focus:bg-transparent focus:text-amber-500 rounded w-12 md:w-20 h-auto aspect-square md:h-16"
          aria-label="${Translator.__(`Menu:Unit:Label:${type}`, { value: unit.label })}"
          data-var="action"
        >
          <div class="text-xl md:text-2xl font-black">${unit.shortLabel}</div>
          <div class="hidden md:block text-ellipsis overflow-hidden text-xs">${Translator.__(`Menu:Unit:${type}`)}</div>
        </button>`)
        .addEventListener('action', 'click', () => {
          this.openUnitMenu($root, type)
        })
      this.layout.append('unitList', button)
    })
  }

  openUnitMenu ($root, type) {
    const menu = new Brique(`<div class="absolute inset-0 text-white overflow-y-auto p-2 flex flex-col items-center bg-black/80 backdrop-blur-sm z-10" data-var="overlay">
      <div class="flex flex-col items-center gap-2" data-var="menu">
        <button class="bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded p-2 w-full text-xl flex gap-2 items-center justify-center h-12" data-var="close">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          ${Translator.__('Menu:close')}
        </button>
      </div>
    </div>`)
    menu.appendTo($root)

    const closeMenu = () => {
      menu.remove()
    }

    menu.addEventListener('close', 'click', closeMenu)
    menu.addEventListener('overlay', 'click', closeMenu)

    this.getUnitList(type).forEach((value) => {
      const button = new Brique(`<button class="bg-amber-500 hover:bg-transparent hover:text-amber-500 focus:bg-transparent focus:text-amber-500 rounded p-2 w-full text-xl h-12" data-var="action">${value.label}</button>`)
        .addEventListener('action', 'click', () => {
          this.setUnit(type, value.code)
          closeMenu()
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
