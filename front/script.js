import operate from './operate.js'

import resolveByHand from './resolveByHand/resolveByHand.js'


operate('read', 'notes').then(console.log)



Object.assign(window, {masterClerk: operate})
