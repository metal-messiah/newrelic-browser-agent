
import { handle } from '../../../common/event-emitter/handle'
import { now, getOffset, getLastTimestamp } from '../../../common/timing/now'
import { onDOMContentLoaded, onWindowLoad } from '../../../common/window/load'

export function initialize() {
  handle('mark', ['firstbyte', getLastTimestamp()], null, 'api')

  onWindowLoad(measureWindowLoaded)
  onDOMContentLoaded(measureDomContentLoaded)
}

function measureWindowLoaded() {
  var ts = now()
  handle('mark', ['onload', ts + getOffset()], null, 'api')
  handle('timing', ['load', ts])
}

function measureDomContentLoaded () {
  handle('mark', ['domContent', now() + getOffset()], null, 'api')
}
