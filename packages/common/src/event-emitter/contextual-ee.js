/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { getOrSet } from '../util/get-or-set'
import { mapOwn } from '../util/map-own'

var ctxId = 'nr@context'

// create global emitter instance that can be shared among bundles
var globalInstance = window.NREUM.ee || ee()
if (window.NREUM.ee) {
  globalInstance = window.NREUM.ee
} else {
  globalInstance = ee()
  window.NREUM.ee = globalInstance
}

// export default ee()
var baseEE = ee()

export { baseEE as ee }

export { globalInstance as global }

function EventContext () {}

function ee (old) {
  var handlers = {}
  var bufferGroupMap = {}
  var emitters = {}

  var emitter = {
    on: addEventListener,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    emit: emit,
    get: getOrCreate,
    listeners: listeners,
    context: context,
    buffer: bufferEventsByGroup,
    abort: abortIfNotLoaded,
    aborted: false,
    isBuffering: isBuffering
  }

  // buffer is associated with a base emitter, since there are two
  // (global and scoped to the current bundle), it is now part of the emitter
  if (!old) {
    emitter.backlog = {}
  }

  return emitter

  function context (contextOrStore) {
    if (contextOrStore && contextOrStore instanceof EventContext) {
      return contextOrStore
    } else if (contextOrStore) {
      return getOrSet(contextOrStore, ctxId, getNewContext)
    } else {
      return getNewContext()
    }
  }

  function emit (type, args, contextOrStore, force, bubble) {
    if (bubble !== false) bubble = true
    if (baseEE.aborted && !force) { return }
    if (old && bubble) old.emit(type, args, contextOrStore)

    var ctx = context(contextOrStore)
    var handlersArray = listeners(type)
    var len = handlersArray.length

    // Extremely verbose debug logging
    // if ([/^xhr/].map(function (match) {return type.match(match)}).filter(Boolean).length) {
    //  console.log(type + ' args:')
    //  console.log(args)
    //  console.log(type + ' handlers array:')
    //  console.log(handlersArray)
    //  console.log(type + ' context:')
    //  console.log(ctx)
    //  console.log(type + ' ctxStore:')
    //  console.log(ctxStore)
    // }

    // Apply each handler function in the order they were added
    // to the context with the arguments

    for (var i = 0; i < len; i++) handlersArray[i].apply(ctx, args)

    // Buffer after emitting for consistent ordering
    var bufferGroup = getBuffer()[bufferGroupMap[type]]
    if (bufferGroup) {
      bufferGroup.push([emitter, type, args, ctx])
    }

    // Return the context so that the module that emitted can see what was done.
    return ctx
  }

  function addEventListener (type, fn) {
    // Retrieve type from handlers, if it doesn't exist assign the default and retrieve it.
    handlers[type] = listeners(type).concat(fn)
  }

  function removeEventListener (type, fn) {
    var listeners = handlers[type]
    if (!listeners) return
    for (var i = 0; i < listeners.length; i++) {
      if (listeners[i] === fn) {
        listeners.splice(i, 1)
      }
    }
  }

  function listeners (type) {
    return handlers[type] || []
  }

  function getOrCreate (name) {
    return (emitters[name] = emitters[name] || ee(emitter))
  }

  function bufferEventsByGroup (types, group) {
    var eventBuffer = getBuffer()

    // do not buffer events if agent has been aborted
    if (emitter.aborted) return
    mapOwn(types, function (i, type) {
      group = group || 'feature'
      bufferGroupMap[type] = group
      if (!(group in eventBuffer)) {
        eventBuffer[group] = []
      }
    })
  }

  function isBuffering(type) {
    var bufferGroup = getBuffer()[bufferGroupMap[type]]
    return !!bufferGroup
  }

  // buffer is associated with a base emitter, since there are two
  // (global and scoped to the current bundle), it is now part of the emitter
  function getBuffer() {
    if (old) {
      return old.backlog
    }
    return emitter.backlog
  }
}

// get context object from store object, or create if does not exist
export function getOrSetContext(obj) {
  return getOrSet(obj, ctxId, getNewContext)
}

function getNewContext () {
  return new EventContext()
}

// abort should be called 30 seconds after the page has started running
// We should drop our data and stop collecting if we still have a backlog, which
// signifies the rest of the agent wasn't loaded
function abortIfNotLoaded () {
  console.log('aborted!')
  if (baseEE.backlog.api || baseEE.backlog.feature) {
    baseEE.aborted = true
    baseEE.backlog = {}
  }
}
