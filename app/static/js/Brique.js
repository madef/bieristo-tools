'use strict'

/**
 *  Copyright (c) 2024 MAXENCE DE FLOTTE
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/**
 * Brique.js is a minimalist template manager for JS
 */

import InvalidNodeIdentifier from './Exception/InvalidNodeIdentifier.js'

class Brique {
  constructor (template, varAttribute = 'data-var', rootType = 'div') {
    this.$root = document.createElement(rootType)
    this.$root.innerHTML = template
    this.varAttribute = varAttribute
    this.children = Array.from(this.$root.children)
  }

  getChildren () {
    return this.children
  }

  get (identifier) {
    for (const $child of this.getChildren()) {
      if ($child.getAttribute(this.varAttribute) === identifier) {
        return $child
      }

      const $node = $child.querySelector(`[${this.varAttribute}=${identifier}]`)
      if ($node) {
        return $node
      }
    }

    throw new InvalidNodeIdentifier(`Invalid identifier ${identifier}`)
  }

  forEach (identifier, callback) {
      console.log('forEach', identifier, callback);
    for (const $child of this.getChildren()) {
      if ($child.getAttribute(this.varAttribute) === identifier) {
        callback($child)
      }

      $child.querySelectorAll(`[${this.varAttribute}=${identifier}]`).forEach($node => callback($node))
    }

    return this
  }

  appendTo (node, identifier) {
    let children = this.getChildren()

    if (typeof identifier === 'string') {
      children = [this.get(identifier)]
    }

    for (const $child of children) {
      node.append($child)
    }

    return this
  }

  append (identifier, node) {
    if (node instanceof Brique) {
      for (const $child of node.getChildren()) {
        this.append(identifier, $child)
      }
    } else {
      this.get(identifier).append(node)
    }
    return this
  }

  prepend (identifier, node) {
    this.get(identifier).prepend(node)
    return this
  }

  empty (identifier) {
    this.get(identifier).replaceChildren()
    return this
  }

  remove (identifier) {
    if (typeof identifier === 'undefined') {
      for (const $child of this.getChildren()) {
        $child.remove()
      }
    } else {
      this.get(identifier).remove()
    }

    return this
  }

  call (identifier, callback) {
    callback(this.get(identifier))
    return this
  }

  style (identifier, callback) {
    callback(this.get(identifier).style)
    return this
  }

  classList (identifier, callback) {
    callback(this.get(identifier).classList)
    return this
  }

  addEventListener (identifier, type, callback, options) {
    if (!(type instanceof Array)) {
      type = [type]
    }

    type.forEach((type) => {
      this.get(identifier).addEventListener(type, callback, options)
    })

    return this
  }

  removeEventListener (identifier, type, callback, options) {
    if (!(type instanceof Array)) {
      type = [type]
    }

    type.forEach((type) => {
      this.get(identifier).removeEventListener(type, callback, options)
    })

    return this
  }
}

export default Brique
