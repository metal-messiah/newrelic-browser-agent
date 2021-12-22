/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

var handleEE = require('nr-browser-common').ee

module.exports = defaultRegister

defaultRegister.on = registerWithSpecificEmitter

var handlers = defaultRegister.handlers = {}

function defaultRegister (type, handler, group, ee) {
  registerWithSpecificEmitter(ee || handleEE, type, handler, group)
}

function registerWithSpecificEmitter (ee, type, handler, group) {
  if (!group) group = 'feature'
  if (!ee) ee = handleEE

  if (ee.isBuffering(group, type)) {
    var groupHandlers = handlers[group] = handlers[group] || {}
    var list = groupHandlers[type] = groupHandlers[type] || []
    list.push([ee, handler])
  } else {
    ee.on(type, handler)
  }
}
