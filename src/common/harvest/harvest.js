/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { mapOwn } from '../util/map-own'
import { obj as encodeObj, param as encodeParam } from '../url/encode'
import { stringify } from '../util/stringify'
import { submitData } from '../util/submit-data'
import { getLocation } from '../url/location'
import { getInfo, getConfigurationValue, getRuntime, getConfiguration } from '../config/config'
import { cleanURL } from '../url/clean-url'
import { now } from '../timing/now'
import { eventListenerOpts } from '../event-listener/event-listener-opts'
import { Obfuscator } from '../util/obfuscate'
import { applyFnToProps } from '../util/traverse'
import { SharedContext } from '../context/shared-context'
import { VERSION } from '../constants/env'
import { isBrowserScope, isWorkerScope } from '../util/global-scope'

const haveSendBeacon = !!navigator.sendBeacon // only the web window obj has sendBeacon at this time, so 'false' for other envs

export class Harvest extends SharedContext {
  constructor (parent) {
    super(parent) // gets any allowed properties from the parent and stores them in `sharedContext`

    this.tooManyRequestsDelay = getConfigurationValue(this.sharedContext.agentIdentifier, 'harvest.tooManyRequestsDelay') || 60
    this.obfuscator = new Obfuscator(this.sharedContext)
    this.getScheme = () => (getConfigurationValue(this.sharedContext.agentIdentifier, 'ssl') === false) ? 'http' : 'https'

    this._events = {}
  }

  /**
   * Initiate a harvest from multiple sources. An event that corresponds to the endpoint
   * name is emitted, which gives any listeners the opportunity to provide payload data.
   *
   * @param {string} endpoint - The endpoint of the harvest (jserrors, events, resources etc.)
   *
   * @param {object} opts
   * @param {bool} opts.needResponse - Specify whether the caller expects a response data.
   * @param {bool} opts.unload - Specify whether the call is a final harvest during page unload.
   */
  sendX (endpoint, opts, cbFinished) {
    var submitMethod = getSubmitMethod(endpoint, opts)
    if (!submitMethod) return false
    var options = {
      retry: submitMethod.method === submitData.xhr
    }
    return this.obfuscator.shouldObfuscate() ? this.obfuscateAndSend(endpoint, this.createPayload(endpoint, options), opts, submitMethod, cbFinished) : this._send(endpoint, this.createPayload(endpoint, options), opts, submitMethod, cbFinished)
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
  send (endpoint, singlePayload, opts, submitMethod, cbFinished) {
    var makeBody = createAccumulator()
    var makeQueryString = createAccumulator()
    if (singlePayload.body) mapOwn(singlePayload.body, makeBody)
    if (singlePayload.qs) mapOwn(singlePayload.qs, makeQueryString)

    var payload = { body: makeBody(), qs: makeQueryString() }
    var caller = this.obfuscator.shouldObfuscate() ? (...args) => this.obfuscateAndSend(...args) : (...args) => this._send(...args)

    return caller(endpoint, payload, opts, submitMethod, cbFinished)
  }

  obfuscateAndSend (endpoint, payload, opts, submitMethod, cbFinished) {
    applyFnToProps(payload, (...args) => this.obfuscator.obfuscateString(...args), 'string', ['e'])
    return this._send(endpoint, payload, opts, submitMethod, cbFinished)
  }

  _send (endpoint, payload, opts, submitMethod, cbFinished) {
    var info = getInfo(this.sharedContext.agentIdentifier)
    if (!info.errorBeacon) return false

    var agentRuntime = getRuntime(this.sharedContext.agentIdentifier)

    if (!payload.body) { // no payload body? nothing to send, just run onfinish stuff and return
      if (cbFinished) {
        cbFinished({ sent: false })
      }
      return false
    }

    if (!opts) opts = {}

    var url = this.getScheme() + '://' + info.errorBeacon + '/' + endpoint + '/1/' + info.licenseKey + this.baseQueryString()
    if (payload.qs) url += encodeObj(payload.qs, agentRuntime.maxBytes)

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
      fullUrl = url + encodeObj(payload.body, agentRuntime.maxBytes)
    }

    // Get bytes harvested per endpoint as a supportability metric. See metrics aggregator (on unload).
    agentRuntime.bytesSent[endpoint] = (agentRuntime.bytesSent[endpoint] || 0) + body?.length || 0

    /* Since workers don't support sendBeacon right now, or Image(), they can only use XHR method.
        Because they still do permit synch XHR, the idea is that at final harvest time (worker is closing),
        we just make a BLOCKING request--trivial impact--with the remaining data as a temp fill-in for sendBeacon. */
    var result = method(fullUrl, body, opts.unload && isWorkerScope)

    if (cbFinished && method === submitData.xhr) {
      var xhr = result
      xhr.addEventListener('load', function () {
        var result = { sent: true }
        if (this.status === 429) {
          result.retry = true
          result.delay = this.tooManyRequestsDelay
        } else if (this.status === 408 || this.status === 500 || this.status === 503) {
          result.retry = true
        }

        if (opts.needResponse) {
          result.responseText = this.responseText
        }
        cbFinished(result)
      }, eventListenerOpts(false))
    }

    // if beacon request failed, retry with an alternative method -- will not happen for workers
    if (!result && method === submitData.beacon) {
      method = submitData.img
      result = method(url + encodeObj(payload.body, agentRuntime.maxBytes))
    }

    return result
  }

  // The stuff that gets sent every time.
  baseQueryString () {
    var runtime = getRuntime(this.sharedContext.agentIdentifier)
    var info = getInfo(this.sharedContext.agentIdentifier)

    var location = cleanURL(getLocation())
    var ref = this.obfuscator.shouldObfuscate() ? this.obfuscator.obfuscateString(location) : location

    return ([
      '?a=' + info.applicationID,
      encodeParam('sa', (info.sa ? '' + info.sa : '')),
      encodeParam('v', VERSION),
      transactionNameParam(info),
      encodeParam('ct', runtime.customTransaction),
      '&rst=' + now(),
      '&ck=0', // ck param DEPRECATED - still expected by backend
      '&s=' + (runtime.sessionId || '0'), // the 0 id encaps all untrackable and default traffic
      encodeParam('ref', ref),
      encodeParam('ptid', (runtime.ptid ? '' + runtime.ptid : ''))
    ].join(''))
  }

  createPayload (type, options) {
    var makeBody = createAccumulator()
    var makeQueryString = createAccumulator()
    var listeners = ((this._events[type] && this._events[type]) || [])

    for (var i = 0; i < listeners.length; i++) {
      var singlePayload = listeners[i](options)
      if (!singlePayload) continue
      if (singlePayload.body) mapOwn(singlePayload.body, makeBody)
      if (singlePayload.qs) mapOwn(singlePayload.qs, makeQueryString)
    }
    return { body: makeBody(), qs: makeQueryString() }
  }

  on (type, listener) {
    var listeners = (this._events[type] || (this._events[type] = []))
    listeners.push(listener)
  }

  resetListeners () {
    mapOwn(this._events, (key) => {
      this._events[key] = []
    })
  }
}

function or (a, b) { return a || b }

export function getSubmitMethod (endpoint, opts) {
  opts = opts || {}
  var method
  var useBody

  if (opts.needResponse) { // currently: only STN needs a response
    useBody = true
    method = submitData.xhr
  } else if (opts.unload && isBrowserScope) { // all the features' final harvest; neither methods work outside window context
    useBody = haveSendBeacon
    method = haveSendBeacon ? submitData.beacon : submitData.img // really only IE doesn't have Beacon API for web browsers
  } else {
    // `submitData.beacon` was removed, there is an upper limit to the
    // number of data allowed before it starts failing, so we save it only for page unloading
    useBody = true
    method = submitData.xhr
  }

  return {
    method: method,
    useBody: useBody
  }
}

// Constructs the transaction name param for the beacon URL.
// Prefers the obfuscated transaction name over the plain text.
// Falls back to making up a name.
function transactionNameParam (info) {
  if (info.transactionName) return encodeParam('to', info.transactionName)
  return encodeParam('t', info.tNamePlain || 'Unnamed Transaction')
}

// returns a function that can be called to accumulate values to a single object
// when the function is called without parameters, then the accumulator is returned
function createAccumulator () {
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
