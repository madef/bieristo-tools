'use strict'

import Brique from './Brique.js'
import Translator from './Translator.js'
import BlockHistory from './BlockHistory.js'
import History from './History.js'
import Unit from './Unit.js'
import Confirm from './Confirm.js'

class ViewVolumeRetractation {
  constructor ($content) {
    this.history = new History('ViewVolumeRetractation')

    this.unit = Unit.getInstance()
    this.unit.addChangeObserver('viewRetractation', (unitType) => {
      if (unitType === 'volume' || unitType === 'temperature') {
        this.view.forEach('volumeUnit', $unit => { $unit.innerText = this.unit.get('volume').shortLabel })
        this.view.forEach('temperatureUnit', $unit => { $unit.innerText = this.unit.get('temperature').shortLabel })

        this.hideResult()
      }
    })

    this.view = new Brique(
      `<div class="flex flex-col gap-4">
        <div class="flex flex-wrap gap-2 p-2">
          <!-- Temperature -->
          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="tempMout" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewVolumeRetractation:Label:tempMout')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white group hover:border-amber-500 focus-within:border-amber-500 pr-2 gap-2">
              <input type="number" autocomplete="off" id="tempMout"
                     class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                     data-var="tempMout" step="0.1">
              <div class="pointer-events-none" data-var="temperatureUnit">${this.unit.get('temperature').shortLabel}</div>
            </div>
          </div>

          <!-- Volume chaud -->
          <div class="w-full md:w-1/3 flex flex-col grow gap-1">
            <label for="volumeT" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewVolumeRetractation:Label:volumeAtTemp')}
            </label>
            <div class="relative rounded-md shadow-sm flex w-full items-center border border-white group hover:border-amber-500 focus-within:border-amber-500 pr-2 gap-2">
              <input type="number" autocomplete="off" id="volumeT"
                     class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                     data-var="volumeT" step="0.01">
              <div class="pointer-events-none" data-var="volumeUnit">${this.unit.get('volume').shortLabel}</div>
            </div>
          </div>

          <!-- Bouton d'action -->
          <div class="w-full sm:w-auto flex flex-col gap-1">
            <label for="action" class="hidden sm:block text-sm font-medium leading-6">&nbsp;</label>
            <button data-var="action"
                    class="flex grow w-full items-stretch gap-2 rounded-md shadow-sm py-1 px-2 text-lg bg-cyan-700 focus:outline-none focus:bg-transparent hover:bg-transparent focus:text-cyan-700 hover:text-cyan-700">
              ${Translator.__('Generic:Action:calculate')}
            </button>
          </div>

          <!-- Resultats : Volume a 20C -->
          <div class="w-full md:w-1/3 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="volume20C" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewVolumeRetractation:Label:volume20C')}
            </label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="volume20C"
                     class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                     data-var="volume20C">
              <div class="pointer-events-none">${this.unit.get('volume').shortLabel}</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500"
                      data-var="copyVolume20C" title="${Translator.__('Generic:Action:copy')}"
                      aria-label="${Translator.__('Generic:Action:copy')}">
                <!-- Icon copy -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="w-full md:w-1/3 flex flex-col grow gap-1 hidden" data-var="result">
            <label for="retractationRate" class="block text-sm font-medium leading-6">
              ${Translator.__('ViewVolumeRetractation:Label:retractationRate')}
            </label>
            <div class="flex w-full items-center gap-2 rounded-md bg-cyan-950 pr-2">
              <input type="text" readonly autocomplete="off" id="retractationRate"
                     class="rounded-md py-1 px-2 bg-transparent w-full text-lg focus:outline-none"
                     data-var="retractationRate">
              <div class="pointer-events-none">%</div>
              <button class="hover:text-amber-500 focus-within:text-amber-500"
                      data-var="copyRetractationRate" title="${Translator.__('Generic:Action:copy')}"
                      aria-label="${Translator.__('Generic:Action:copy')}">
                <!-- Icon copy -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Historique -->
        <div data-var="history"></div>
      </div>`
    ).appendTo($content, true)

    // ======================================
    // Evenements
    // ======================================
    // 1. Clic sur le bouton "Calculer"
    this.view.addEventListener('action', 'click', () => {
      this.updateResult()
      this.view.get('action').blur()
    })

    // 2. Masquer le resultat des que l'utilisateur modifie un champ
    ;['tempMout', 'volumeT'].forEach(key => {
      this.view.addEventListener(key, ['keyup', 'change'], () => {
        this.hideResult()
      })
    })

    // 3. Gestion des boutons "copier"
    ;[
      { button: 'copyVolume20C', input: 'volume20C' },
      { button: 'copyRetractationRate', input: 'retractationRate' }
    ].forEach((action) => {
      this.view.addEventListener(action.button, 'click', () => {
        navigator.clipboard.writeText(this.view.get(action.input).value)
        new Confirm( // eslint-disable-line no-new
          () => {},
          Translator.__('Generic:Confirm:copy'),
          [
            {
              label: Translator.__('Generic:ok'),
              classes: [
                'hover:bg-transparent', 'focus:bg-transparent', 'rounded', 'p-2',
                'grow', 'text-center', 'w-full', 'md:w-auto',
                'bg-teal-700', 'hover:text-teal-700', 'focus:text-teal-700'
              ],
              value: 0
            }
          ]
        )
      })
    })

    // Historique
    this.renderHistory()
    this.setDefaultValue()
  }

  hideResult () {
    this.view.forEach('result', $result => { $result.classList.add('hidden') })
  }

  showResult () {
    this.view.forEach('result', $result => { $result.classList.remove('hidden') })
  }

  getLastHistory () {
    const history = this.history.get()
    if (history.length) {
      return history[0]
    }
    return null
  }

  setDefaultValue () {
    const last = this.getLastHistory()
    if (last) {
      this.view.get('tempMout').value = last.values[0]
      this.view.get('volumeT').value = last.values[1]
      this.updateResult()
    }
  }

  volumeAt20C (temp, volumeT) {
    const temperature = this.unit.get('temperature')
    temp = temperature.convert(temp).C

    const ratio = this.densityOfWater(temp) / this.densityOfWater(20)

    return volumeT * ratio
  }

  retractationRate (temp, volumeT) {
    const v20 = this.volumeAt20C(temp, volumeT)
    return ((volumeT - v20) / volumeT) * 100
  }

  updateResult () {
    const tempMout = parseFloat(this.view.get('tempMout').value) || 0
    const volumeT = parseFloat(this.view.get('volumeT').value) || 0

    const vol20C = this.round(this.volumeAt20C(tempMout, volumeT))
    const taux = this.round(this.retractationRate(tempMout, volumeT))

    this.view.get('volume20C').value = vol20C
    this.view.get('retractationRate').value = taux
    this.showResult()

    const display = `${volumeT}${this.unit.get('volume').shortLabel} @${tempMout}${this.unit.get('temperature').shortLabel} => ${vol20C}${this.unit.get('volume').shortLabel} @20C, ${taux}%`
    if (!this.getLastHistory() || this.getLastHistory().display !== display) {
      const values = [tempMout, volumeT]
      const units = [this.unit.get('volume').code, this.unit.get('temperature').code]

      this.history.addRow({
        values,
        units,
        display
      })
    }
  }

  renderHistory () {
    new BlockHistory( // eslint-disable-line no-new
      this.view.get('history'),
      this.history,
      (historyRow) => {
        this.view.get('tempMout').value = historyRow.values[0]
        this.view.get('volumeT').value = historyRow.values[1]
        this.unit.set('volume', historyRow.units[0])
        this.unit.set('temperature', historyRow.units[1])
        this.hideResult()
      }
    )
  }

  round (value, precision = 2) {
    return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
  }

  densityOfWater (t) {
    const DENSITY_TABLE = [
      [0, 999.84],
      [4, 999.97], // densite max de l'eau
      [20, 998.20],
      [40, 992.20],
      [60, 983.20],
      [80, 971.80],
      [100, 958.36] // valeur IAPWS a 100°C
    ]

    // 1) Borne la temperature
    if (t < 0) t = 0
    if (t > 100) t = 100

    // 2) Parcours la table
    for (let i = 0; i < DENSITY_TABLE.length - 1; i++) {
      const [t0, d0] = DENSITY_TABLE[i]
      const [t1, d1] = DENSITY_TABLE[i + 1]

      // Si t est dans l'intervalle [t0, t1]
      if (t >= t0 && t <= t1) {
        // 3) Interpolation lineaire
        const ratio = (t - t0) / (t1 - t0)
        // densite = d0 + (d1 - d0) * ratio
        return d0 + (d1 - d0) * ratio
      }
    }

    // Si jamais on ne trouve rien, on renvoie la densite mini ou maxi
    // (situation theoriquement impossible ici vu le bornage)
    return DENSITY_TABLE[DENSITY_TABLE.length - 1][1]
  }
}

export default ViewVolumeRetractation
