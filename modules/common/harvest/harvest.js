/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { mapOwn } from '../util/map-own'
import { obj as encodeObj, param as encodeParam } from '../url/encode'
import { stringify } from '../util/stringify'
import { submitData } from '../util/submit-data'
import { reduce } from '../util/reduce'
import { getLocation } from '../url/location'
import {getInfo, getConfigurationValue, getRuntime, getConfiguration} from '../config/config'
import { cleanURL } from '../url/clean-url'
import { now } from '../timing/now'
import { eventListenerOpts } from '../event-listener/event-listener-opts'
import { ieVersion } from '../browser-version/ie-version'
import { VERSION as NR_VERSION } from '../constants/environment-variables'

const version = NR_VERSION
// var version = '<VERSION>'
// var jsonp = 'NREUM.setToken'
var _events = {}
var haveSendBeacon = !!navigator.sendBeacon
var tooManyRequestsDelay = getConfigurationValue('harvest.tooManyRequestsDelay') || 60
var getScheme = () => (getConfigurationValue('ssl') === false) ? 'http' : 'https'

// requiring ie version updates the IE version on the loader object
// var ieVersion = require('./ie-version')
export var xhrUsable = ieVersion > 9 || ieVersion === 0

// export default {
//   sendFinal: sendAllFromUnload,
//   sendX: sendX,
//   send: send,
//   on: on,
//   xhrUsable: xhrUsable,
//   resetListeners: resetListeners,
//   getSubmitMethod: getSubmitMethod
// }

export { sendAllFromUnload as sendFinal }

function sendAllFromUnload() {
  var sents = mapOwn(_events, function (endpoint) {
    return sendX(endpoint, { unload: true })
  })
  return reduce(sents, or)
}

function or(a, b) { return a || b }

function createPayload(type, options) {
  var makeBody = createAccumulator()
  var makeQueryString = createAccumulator()
  var listeners = (_events[type] && _events[type] || [])

  for (var i = 0; i < listeners.length; i++) {
    var singlePayload = listeners[i](options)
    if (!singlePayload) continue
    if (singlePayload.body) mapOwn(singlePayload.body, makeBody)
    if (singlePayload.qs) mapOwn(singlePayload.qs, makeQueryString)
  }
  return { body: makeBody(), qs: makeQueryString() }
}

/**
 * Initiate a harvest from multiple sources. An event that corresponds to the endpoint
 * name is emitted, which gives any listeners the opportunity to provide payload data.
 *
 * @param {string} endpoint - The endpoint of the harvest (jserrors, events, resources etc.)
 * @param {object} nr - The loader singleton.
 *
 * @param {object} opts
 * @param {bool} opts.needResponse - Specify whether the caller expects a response data.
 * @param {bool} opts.unload - Specify whether the call is a final harvest during page unload.
 */
export function sendX(endpoint, opts, cbFinished) {
  var submitMethod = getSubmitMethod(endpoint, opts)
  // log('submit method', submitMethod)
  if (!submitMethod) return false
  var options = {
    retry: submitMethod.method === submitData.xhr
  }
  // log('_send!', endpoint, opts, options)
  return _send(endpoint, createPayload(endpoint, options), opts, submitMethod, cbFinished)
}

/**
 * Initiate a harvest call.
 *
 * @param {string} endpoint - The endpoint of the harvest (jserrors, events, resources etc.)
 * @param {object} nr - The loader singleton.
 *
 * @param {object} singlePayload - Object representing payload.
 * @param {object} singlePayload.qs - Map of values that should be sent as part of the request query string.
 * @param {string} singlePayload.body - String that should be sent as the body of the request.
 * @param {string} singlePayload.body.e - Special case of body used for browser interactions.
 *
 * @param {object} opts
 * @param {bool} opts.needResponse - Specify whether the caller expects a response data.
 * @param {bool} opts.unload - Specify whether the call is a final harvest during page unload.
 */
export function send(endpoint, singlePayload, opts, submitMethod, cbFinished) {
  var makeBody = createAccumulator()
  var makeQueryString = createAccumulator()
  if (singlePayload.body) mapOwn(singlePayload.body, makeBody)
  if (singlePayload.qs) mapOwn(singlePayload.qs, makeQueryString)

  var payload = { body: makeBody(), qs: makeQueryString() }
  return _send(endpoint, payload, opts, submitMethod, cbFinished)
}

function _send(endpoint, payload, opts, submitMethod, cbFinished) {
  var info = getInfo()
  // log('info in send!', info)
  if (!info.errorBeacon) return false

  if (!payload.body) {
    // log('no payload body')
    if (cbFinished) {
      cbFinished({ sent: false })
    }
    return false
  }

  if (!opts) opts = {}

  // log("_send... getScheme!", getScheme())
  var url = getScheme() + '://' + info.errorBeacon + '/' + endpoint + '/1/' + info.licenseKey + baseQueryString()
  if (payload.qs) url += encodeObj(payload.qs, getRuntime().maxBytes)

  if (!submitMethod) {
    submitMethod = getSubmitMethod(endpoint, opts)
  }
  var method = submitMethod.method
  var useBody = submitMethod.useBody

  var body
  var fullUrl = url
  if (useBody && endpoint === 'events') {
    body = payload.body.e
  } else if (useBody) {
    body = stringify(payload.body)
  } else {
    fullUrl = url + encodeObj(payload.body, getRuntime().maxBytes)
  }

  var result = method(fullUrl, body)

  // log('result...', result)
  if (cbFinished && method === submitData.xhr) {
    // log('in cbFinished')
    var xhr = result
    xhr.addEventListener('load', function () {
      var result = { sent: true }
      if (this.status === 429) {
        result.retry = true
        result.delay = tooManyRequestsDelay
      } else if (this.status === 408 || this.status === 500 || this.status === 503) {
        result.retry = true
      }

      if (opts.needResponse) {
        result.responseText = this.responseText
      }
      cbFinished(result)
    }, eventListenerOpts(false))
  }

  // if beacon request failed, retry with an alternative method
  if (!result && method === submitData.beacon) {
    method = submitData.img
    result = method(url + encodeObj(payload.body, getRuntime().maxBytes))
  }

  return result
}

export function getSubmitMethod(endpoint, opts) {
  opts = opts || {}
  var method
  var useBody

  if (opts.needResponse) {
    if (xhrUsable) {
      useBody = true
      method = submitData.xhr
    } else {
      return false
    }
  } else if (opts.unload) {
    useBody = haveSendBeacon
    method = haveSendBeacon ? submitData.beacon : submitData.img
  } else {
    // `submitData.beacon` was removed, there is an upper limit to the
    // number of data allowed before it starts failing, so we save it for
    // unload data
    if (xhrUsable) {
      useBody = true
      method = submitData.xhr
    } else if (endpoint === 'events' || endpoint === 'jserrors') {
      method = submitData.img
    } else {
      return false
    }
  }

  return {
    method: method,
    useBody: useBody
  }
}

// Constructs the transaction name param for the beacon URL.
// Prefers the obfuscated transaction name over the plain text.
// Falls back to making up a name.
function transactionNameParam(info) {
  if (info.transactionName) return encodeParam('to', info.transactionName)
  return encodeParam('t', info.tNamePlain || 'Unnamed Transaction')
}

export function on(type, listener) {
  var listeners = (_events[type] || (_events[type] = []))
  listeners.push(listener)
}

export function resetListeners() {
  mapOwn(_events, function (key) {
    _events[key] = []
  })
}

// The stuff that gets sent every time.
export function baseQueryString() {
  var areCookiesEnabled = true
  const init = getConfiguration()
  if ('privacy' in init) {
    areCookiesEnabled = init.privacy.cookies_enabled
  }

  var info = getInfo()

  return ([
    '?a=' + info.applicationID,
    encodeParam('sa', (info.sa ? '' + info.sa : '')),
    encodeParam('v', version),
    transactionNameParam(info),
    encodeParam('ct', getRuntime().customTransaction),
    '&rst=' + now(),
    '&ck=' + (areCookiesEnabled ? '1' : '0'),
    encodeParam('ref', cleanURL(getLocation())),
    encodeParam('ptid', (getRuntime().ptid ? '' + getRuntime().ptid : ''))
  ].join(''))
}

// returns a function that can be called to accumulate values to a single object
// when the function is called without parameters, then the accumulator is returned
function createAccumulator() {
  var accumulator = {}
  var hasData = false
  return function (key, val) {
    if (val && val.length) {
      accumulator[key] = val
      hasData = true
    }
    if (hasData) return accumulator
  }
}
