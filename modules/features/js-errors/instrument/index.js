/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { handle } from '../../../common/event-emitter/handle'
import { ee } from '../../../common/event-emitter/contextual-ee'
import { getRuntime } from '../../../common/config/config'
import { now } from '../../../common/timing/now'
import { getOrSet } from '../../../common/util/get-or-set'
import { wrapRaf, wrapTimer, wrapGlobalEvents, wrapXhr } from '../../../common/wrap'
import slice from 'lodash._slice'
import './debug'
import { FeatureBase } from '../../../common/util/feature-base'

var origOnerror = window.onerror
var handleErrors = false
var NR_ERR_PROP = 'nr@seenError'

// skipNext counter to keep track of uncaught
// errors that will be the same as caught errors.
// var skipNext = 0

export class Instrument extends FeatureBase {
  constructor(agentIdentifier) {
    super(agentIdentifier)
    // skipNext counter to keep track of uncaught
    // errors that will be the same as caught errors.
    this.skipNext = 0
    ee.on('fn-start', function (args, obj, methodName) {
      if (handleErrors) this.skipNext += 1
    })

    ee.on('fn-err', function (args, obj, err) {
      if (handleErrors && !err[NR_ERR_PROP]) {
        getOrSet(err, NR_ERR_PROP, function getVal() {
          return true
        })
        this.thrown = true
        notice(err)
      }
    })

    ee.on('fn-end', function () {
      if (!handleErrors) return
      if (!this.thrown && this.skipNext > 0) this.skipNext -= 1
    })

    ee.on('internal-error', function (e) {
      handle('ierr', [e, now(), true])
    })

    // Declare that we are using err instrumentation
    // require('./debug')

    const prevOnError = window.onerror
    const newOnError = this.onerrorHandler
    window.onerror = (...args) => {
      if (prevOnError) prevOnError(...args)
      newOnError(...args)
    }

    try {
      throw new Error()
    } catch (e) {
      // Only wrap stuff if try/catch gives us useful data. It doesn't in IE < 10.
      if ('stack' in e) {
        wrapTimer()
        wrapRaf()

        if ('addEventListener' in window) {
          wrapGlobalEvents()
        }

        if (getRuntime(this.agentIdentifier).xhrWrappable) {
          wrapXhr()
        }

        handleErrors = true
      }
    }
  }

  // FF and Android browsers do not provide error info to the 'error' event callback,
  // so we must use window.onerror
  onerrorHandler(message, filename, lineno, column, errorObj) {
    try {
      if (this.skipNext) this.skipNext -= 1
      else notice(errorObj || new UncaughtException(message, filename, lineno), true)
    } catch (e) {
      try {
        handle('ierr', [e, now(), true])
      } catch (err) {
        // do nothing
      }
    }

    if (typeof origOnerror === 'function') return origOnerror.apply(this, slice(arguments))
    return false
  }
}

function UncaughtException(message, filename, lineno) {
  this.message = message || 'Uncaught error with no additional information'
  this.sourceURL = filename
  this.line = lineno
}

// emits 'handle > error' event, which the error aggregator listens on
function notice(err, doNotStamp) {
  // by default add timestamp, unless specifically told not to
  // this is to preserve existing behavior
  var time = (!doNotStamp) ? now() : null
  handle('err', [err, time])
}
