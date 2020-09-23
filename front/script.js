import operate from './frontOperate.js'

import resolveByHand from './resolveByHand/resolveByHand.js'


operate('read', 'notes').then(console.log).catch(console.error)

const fireBtn = document.getElementById('fireBtn')
fireBtn.onclick = () => {
  delete localStorage.MDS_dataClerk
  location.reload()
}


Object.assign(window, {masterClerk: operate})
