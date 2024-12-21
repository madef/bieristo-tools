'use strict'

import Brique from './Brique.js'

class LayoutBleuScreenOfDeath {
  constructor ($root, error) {
    $root.replaceChildren()
    new Brique(`
      <div class="absolute inset-0 bg-main flex justify-center items-center text-white">
        <div class="border border-error text-error rounded p-2 bg-box">${error}</div>
      </div>
    `)
      .appendTo($root)
  }
}

export default LayoutBleuScreenOfDeath
