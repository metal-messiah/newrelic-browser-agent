/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

const jil = require('jil')
const { setup } = require('../utils/setup')

const setupData = setup()
const {agentIdentifier, aggregator} = setupData

jil.browserTest('stn aggregator does nothing in ie compatability mode', function (t) {
  require('../../../agent/ie-version')
  var {Aggregate: StnAggregate} = require('../../../packages/browser-agent-core/features/session-trace/aggregate/index')
  var stnAgg = new StnAggregate(agentIdentifier, aggregator)
  var {drain} = require('../../../packages/browser-agent-core/common/drain/drain')

  drain(agentIdentifier, 'feature')

  // When a user is running >= IE10 in compatibility mode
  // with standards <= IE9, we should not submit session trace
  // data. The agent avoids submission by bailing out of the
  // STN aggregation code. When the aggregator is required
  // under these circumstances, it will return an empty object
  t.deepEqual(stnAgg, {})
  t.end()
})
