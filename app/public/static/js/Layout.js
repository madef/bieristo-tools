'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import Unit from './Unit.js'
import View from './View.js'
import User from './User.js'
import ViewAccount from './ViewAccount.js'
import ViewNote from './ViewNote.js'
import ViewUnit from './ViewUnit.js'

class Layout {
  constructor ($root) {
    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('layout', () => { this.renderUnitList($root) })

    this.user = User.getInstance()
    this.user.setStatusObserver(() => { this.refreshUserView() })
    this.user.setDataChangedObserver(() => { this.refresHistory() })

    this.layout = new Brique(`
      <div class="flex flex-col inset-0 bg-main text-white h-svh">
        <div class="p-2">
          <div class="flex overflow-auto justify-start items-start gap-1.5 md:gap-2" data-var="menu">
          </div>
          <div class="flex overflow-auto justify-start items-start gap-1.5 md:gap-2" data-var="submenu">
          </div>
        </div>
        <div class="rounded flex justify-between items-center mb-2 md:mb-6 gap-2 p-2 bg-main">
          <div class="flex gap-2 overflow-x-auto" data-var="unitList"></div>
        </div>
        <div class="grow bg-box overflow-y-auto" data-var="content"></div>
        <div class="grow bg-box overflow-y-auto hidden" data-var="alt-content"></div>
        <div class="p-2 flex justify-between items-start gap-1.5 md:gap-2" data-var="bottom-menu">
        </div>
      </div>
    `)
      .appendTo($root)

    this.renderUnitList($root)

    this.view = new View(this.layout.get('content'))
    this.view.load()

    this.renderMenu()
    this.renderSubmenu()
    this.renderBottomMenu()
  }

  renderMenu () {
    this.layout.empty('menu')
    this.view.getList().forEach((view) => {
      let color = 'amber-500'
      let textColor = 'amber-500'
      if (this.view.get() === view.key) {
        color = 'cyan-700'
        textColor = 'white'
        // group-hover:text-cyan-700
      }

      const button = new Brique(`<button
        class="w-12 md:w-20 flex-none flex flex-col justify-center items-center gap-1 group"
        data-var="${view.key}"
        aria-label="${view.description}"
        title="${view.description}"
      >
        ${view.icon.replaceAll('amber-500', color)}
        <div class="text-sm text-${textColor} text-ellipsis overflow-hidden max-w-full group-hover:text-white group-focus:text-white">${view.label}</div>
      </button>`)
        .addEventListener(view.key, 'click', () => {
          this.view.load(view.key)
          this.closeAltContent()
          this.renderMenu()
          this.renderSubmenu()
        })

      this.layout.append('menu', button)
    })
  }

  renderSubmenu () {
    this.layout.empty('submenu')
    const view = this.view.get()
    if (typeof this.view.getEntry(view).children === 'undefined') {
      return
    }

    this.layout.classList('menu', (classlist) => { classlist.add('hidden') })
    this.layout.classList('submenu', (classlist) => { classlist.remove('hidden') })

    const button = new Brique(`<button
      class="w-12 md:w-20 flex-none flex flex-col justify-center items-center gap-1 group"
      data-var="back"
      aria-label="${Translator.__('Menu:back')}"
      title="${Translator.__('Menu:back')}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-auto aspect-square p-2 rounded bg-violet-500 group-hover:text-violet-500 group-hover:bg-transparent group-focus:text-violet-500 group-focus:bg-transparent" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
      </svg>
      <div class="text-sm text-ellipsis overflow-hidden max-w-full group-hover:text-white group-focus:text-white">${Translator.__('Menu:back')}</div>
    </button>`)
      .addEventListener('back', 'click', () => {
        this.layout.classList('menu', (classlist) => { classlist.remove('hidden') })
        this.layout.classList('submenu', (classlist) => { classlist.add('hidden') })
      })
    this.layout.append('submenu', button)

    this.view.getEntry(view).children.forEach((subview) => {
      let color = 'amber-500'
      let textColor = 'amber-500'
      if (this.view.getSubview() === subview.key) {
        color = 'cyan-700'
        textColor = 'white'
        // group-hover:text-cyan-700
        // text-cyan-700
      }

      const button = new Brique(`<button
        class="w-12 md:w-20 flex-none flex flex-col justify-center items-center gap-1 group"
        data-var="${subview.key}"
        aria-label="${subview.description}"
        title="${subview.description}"
      >
        ${subview.icon.replaceAll('amber-500', color)}
        <div class="text-sm text-${textColor} text-ellipsis overflow-hidden max-w-full group-hover:text-white group-focus:text-white">${subview.label}</div>
      </button>`)
        .addEventListener(subview.key, 'click', () => {
          this.view.load(view, subview.key)
          this.closeAltContent()
          this.renderMenu()
          this.renderSubmenu()
        })
      this.layout.append('submenu', button)
    })
  }

  renderUnitList ($root) {
    this.layout.empty('unitList');

    ['pressure', 'gravity', 'volume', 'temperature', 'length'].forEach((type) => {
      const unit = this.unit.get(type)
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

    this.unit.getList(type).forEach((value) => {
      const button = new Brique(`<button class="bg-amber-500 hover:bg-transparent hover:text-amber-500 focus:bg-transparent focus:text-amber-500 rounded p-2 w-full text-xl h-12" data-var="action">${value.label}</button>`)
        .addEventListener('action', 'click', () => {
          this.unit.set(type, value.code)
          closeMenu()
        })
      menu.append('menu', button)
    })
  }

  refreshUserView () {
    this.renderBottomMenu()

    if (this.currentBottomAction === 'account') {
      new ViewAccount(this.layout.get('alt-content')) // eslint-disable-line no-new
    }
  }

  refresHistory () {
    if (typeof this.view.currentViewInstance === 'object') {
      if (typeof this.view.currentViewInstance.renderHistory === 'function') {
        this.view.currentViewInstance.renderHistory()
      }
      if (this.currentBottomAction === 'calculator') {
        this.currentBottomView.renderHistory()
      }
    }
  }

  renderBottomMenu () {
    this.layout.empty('bottom-menu')

    const accountButton = new Brique(`<button
      class="w-12 flex-none flex flex-col justify-center items-center gap-1 group relative"
      data-var="action"
      aria-label="${Translator.__('ViewAccount:title')}"
      title="${Translator.__('ViewAccount:title')}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-auto aspect-square p-2 rounded bg-${this.currentBottomAction === 'account' ? 'cyan-700' : 'amber-500'} group-hover:text-${this.currentBottomAction === 'account' ? 'cyan-700' : 'amber-500'} group-hover:bg-transparent group-focus:bg-transparent" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="${this.user.isLogged() ? '' : 'hidden'} group-hover:text-${this.currentBottomAction === 'account' ? 'cyan-700' : 'amber-500'} size-4 absolute top-0.5 right-0.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="${this.user.isLogged() ? 'hidden' : ''} group-hover:text-${this.currentBottomAction === 'account' ? 'cyan-700' : 'amber-500'} size-4 absolute top-0.5 right-0.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m3 3 8.735 8.735m0 0a.374.374 0 1 1 .53.53m-.53-.53.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 0 1 0 5.304m2.121-7.425a6.75 6.75 0 0 1 0 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 0 1-1.06-2.122m-1.061 4.243a6.75 6.75 0 0 1-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12Z" />
      </svg>
    </button>`)
      .addEventListener('action', 'click', () => {
        this.switchBottomAction('account', () => {
          new ViewAccount(this.layout.get('alt-content')) // eslint-disable-line no-new
        })
      })
    this.layout.append('bottom-menu', accountButton)

    this.layout.append('bottom-menu', new Brique('<span class="grow"></span>'))

    const calculatorButton = new Brique(`<button
      class="w-12 flex-none flex flex-col justify-center items-center gap-1 group"
      data-var="action"
      aria-label="${Translator.__('ViewUnit:title')}"
      title="${Translator.__('ViewUnit:title')}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-auto aspect-square p-2 rounded bg-${this.currentBottomAction === 'calculator' ? 'cyan-700' : 'amber-500'} group-hover:text-${this.currentBottomAction === 'calculator' ? 'cyan-700' : 'amber-500'} group-hover:bg-transparent group-focus:bg-transparent" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
      </svg>
    </button>`)
      .addEventListener('action', 'click', () => {
        this.switchBottomAction('calculator', () => {
          this.currentBottomView = new ViewUnit(this.layout.get('alt-content')) // eslint-disable-line no-new
        })
      })
    this.layout.append('bottom-menu', calculatorButton)

    const noteButton = new Brique(`<button
      class="w-12 flex-none flex flex-col justify-center items-center gap-1 group"
      data-var="action"
      aria-label="${Translator.__('ViewNote:title')}"
      title="${Translator.__('ViewNote:title')}"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-full h-auto aspect-square p-2 rounded bg-${this.currentBottomAction === 'note' ? 'cyan-700' : 'amber-500'} group-hover:text-${this.currentBottomAction === 'note' ? 'cyan-700' : 'amber-500'} group-hover:bg-transparent group-focus:bg-transparent" aria-hidden="true">
  <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
</svg>
    </button>`)
      .addEventListener('action', 'click', () => {
        this.switchBottomAction('note', () => {
          new ViewNote(this.layout.get('alt-content')) // eslint-disable-line no-new
        })
      })
    this.layout.append('bottom-menu', noteButton)
  }

  switchBottomAction (action, callback) {
    if (this.currentBottomAction === action) {
      this.currentBottomAction = null

      this.layout.classList('content', (classlist) => { classlist.remove('hidden') })
      this.layout.classList('alt-content', (classlist) => { classlist.add('hidden') })
    } else {
      this.currentBottomAction = action

      this.layout.classList('content', (classlist) => { classlist.add('hidden') })
      this.layout.classList('alt-content', (classlist) => { classlist.remove('hidden') })

      callback()
    }

    this.renderBottomMenu()
  }

  closeAltContent () {
    this.currentBottomAction = null
    this.layout.classList('content', (classlist) => { classlist.remove('hidden') })
    this.layout.classList('alt-content', (classlist) => { classlist.add('hidden') })
    this.renderBottomMenu()
  }
}

export default Layout
