'use strict'

import Brique from './Brique.js'

class LayoutBleuScreenOfDeath {
  constructor ($root, error) {
    $root.replaceChildren()
    new Brique(`
      <div>${error}</div>
    `)
      .appendTo($root)
  }
}

export default LayoutBleuScreenOfDeath
