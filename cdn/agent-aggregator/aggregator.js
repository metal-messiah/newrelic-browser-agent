import { getRuntime } from '@newrelic/browser-agent-core/common/config/config'
import { drain } from '@newrelic/browser-agent-core/common/drain/drain'
import { importFeatures } from './util/features'
import { activateFeatures, activatedFeatures } from '@newrelic/browser-agent-core/common/util/feature-flags'
import { addToNREUM, gosNREUMInitializedAgents } from '@newrelic/browser-agent-core/common/window/nreum'
import agentIdentifier from '../shared/agentIdentifier'
import { initializeAPI } from './util/api'

export function aggregator(build) {
  console.log("-- loaded main aggregator module -- ", build)
  const autorun = typeof (getRuntime(agentIdentifier).autorun) !== 'undefined' ? getRuntime(agentIdentifier).autorun : true

  initializeAPI(agentIdentifier)

  // Features are activated using the legacy setToken function name via JSONP
  addToNREUM('setToken', (flags) => activateFeatures(flags, agentIdentifier))

  // import relevant feature aggregators
  if (autorun) initializeFeatures()

  async function initializeFeatures() {
    const features = await importFeatures(build)
    // gosNREUMInitializedAgents(agentIdentifier, features, 'features')
    // once ALL the enabled features all initialized, drain all the buffers
    setTimeout(() => drainAll(), 100)
    // add the activated features from the setToken call to the window for testing purposes
    addToNREUM('activatedFeatures', activatedFeatures)
  }

  function drainAll() {
    drain(agentIdentifier, 'api')
    drain(agentIdentifier, 'feature')
  }

}

