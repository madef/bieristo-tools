'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import Confirm from './Confirm.js'
import User from './User.js'
import Api from './Api.js'
import Unit from './Unit.js'

class ViewAccount {
  constructor ($content) {
    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('ViewAccount', () => { this.renderUnitList() })

    this.user = User.getInstance()
    this.view = new Brique(`<div class="flex flex-col items-center gap-4">
        <div class="rounded flex justify-between items-center mb-2 md:mb-6 gap-2 p-2 bg-main">
          <div class="flex gap-2 overflow-x-auto" data-var="unitList"></div>
        </div>
        <div class="flex flex-col p-2 md:w-1/3 lg:w-1/3 gap-2 pt-4">
          <div class="flex flex-col gap-4">
            <form class="text-lg bg-cyan-700 rounded flex flex-wrap justify-between items-center p-4 gap-2" data-var="create">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="none" class="size-8">
                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
              </svg>
              <input class="grow p-1 bg-cyan-950 rounded-md" type="email" required placeholder="example@domain.com" data-var="email">
              <button type="submit" class="w-full text-right hover:underline">${Translator.__('ViewAccount:create')}</div>
            </form>
            <button class="text-lg bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex justify-between items-center p-4" data-var="save">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              ${Translator.__('ViewAccount:save')}
            </button>
            <button class="text-lg bg-cyan-700 hover:bg-transparent hover:text-cyan-700 focus:bg-transparent focus:text-cyan-700 rounded flex justify-between items-center p-4" data-var="open">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              ${Translator.__('ViewAccount:open')}
            </button>
            <input type="file" class="invisible w-0 absolute" data-var="file" accept=".bieristo.json" />
            <button class="text-lg bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded flex justify-between items-center p-4" data-var="removeLocalData">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              ${Translator.__('ViewAccount:removeLocalData')}
            </button>
            <button class="text-lg bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded flex justify-between items-center p-4" data-var="removeAccount">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              ${Translator.__('ViewAccount:removeAccount')}
            </button>
            <button class="text-lg bg-red-700 hover:bg-transparent hover:text-red-700 focus:bg-transparent focus:text-red-700 rounded flex justify-between items-center p-4" data-var="logout">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="none" class="size-8">
                <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
              </svg>
              ${Translator.__('ViewAccount:disconnect')}
            </button>
          </div>
        </div>
      </div>`)
      .appendTo($content, true)
      .addEventListener('removeLocalData', 'click', () => {
        new Confirm( // eslint-disable-line no-new
          (code) => {
            if (code === 1) {
              localStorage.clear() // eslint-disable-line no-undef
              sessionStorage.clear() // eslint-disable-line no-undef
            }
          },
          Translator.__('ViewAccount:Confirm:removeLocalData')
        )
      })
      .addEventListener('open', 'click', () => {
        this.view.get('file').click()
      })
      .addEventListener('file', 'change', (e) => {
        const file = e.target.files[0]
        if (!file) {
          this.displayError(Translator.__('ViewAccount:Error:cannotLoadFile'))
          return
        }

        const reader = new FileReader() // eslint-disable-line no-undef
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result)
            localStorage.clear() // eslint-disable-line no-undef
            for (const [key, value] of Object.entries(data)) {
              localStorage.setItem(key, value) // eslint-disable-line no-undef
            }
          } catch (e) {
            console.error(e)
            this.displayError(Translator.__('ViewAccount:Error:invalidSyntax'))
          }
        }
        reader.readAsText(file)
      })
      .addEventListener('save', 'click', () => {
        const link = document.createElement('a')
        link.download = `${Translator.__('ViewAccount:filename')}_${new Date().toLocaleString().replaceAll(' ', '-')}.bieristo.json`
        const data = JSON.parse(JSON.stringify(localStorage)) // eslint-disable-line no-undef
        delete data.token
        delete data.lastCheckToken
        delete data.view
        delete data.subview
        delete data.lastChanged
        delete data.lastLoaded
        const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' })
        link.href = window.URL.createObjectURL(blob)
        link.click()
      })
      .addEventListener('create', 'submit', (e) => {
        Api.send('ask-token', { email: this.view.get('email').value }, result => {
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
        })
        e.preventDefault()
      })
      .addEventListener('logout', 'click', () => {
        new Confirm( // eslint-disable-line no-new
          (code) => {
            if (code === 1) {
              localStorage.clear() // eslint-disable-line no-undef
              sessionStorage.clear() // eslint-disable-line no-undef
              window.location.reload()
            }
          },
          Translator.__('ViewAccount:Confirm:logout')
        )
      })
      .addEventListener('removeAccount', 'click', () => {
        new Confirm( // eslint-disable-line no-new
          (code) => {
            if (code === 1) {
              Api.send('delete-user', { token: localStorage.getItem('token') }, result => { // eslint-disable-line no-undef
                if (result.status === 'OK') {
                  localStorage.clear() // eslint-disable-line no-undef
                  sessionStorage.clear() // eslint-disable-line no-undef
                  window.location.reload()
                } else {
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
          },
          Translator.__('ViewAccount:Confirm:removeAccount')
        )
      })

    if (this.user.isLogged()) {
      this.view.classList('create', (classlist) => { classlist.add('hidden') })
      this.view.classList('removeLocalData', (classlist) => { classlist.add('hidden') })
    } else {
      this.view.classList('logout', (classlist) => { classlist.add('hidden') })
      this.view.classList('removeAccount', (classlist) => { classlist.add('hidden') })
    }

    this.renderUnitList()
  }

  displayError (message) {
    new Confirm( // eslint-disable-line no-new
      () => {
      },
      message,
      [
        {
          label: Translator.__('Generic:ok'),
          classes: ['hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2', 'grow', 'text-center', 'w-full', 'md:w-auto', 'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'],
          value: 0
        }
      ]
    )
  }

  renderUnitList () {
    this.view.empty('unitList');

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
          this.openUnitMenu(document.getElementsByTagName('body')[0], type)
        })
      this.view.append('unitList', button)
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
}

export default ViewAccount
