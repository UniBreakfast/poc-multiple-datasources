import resolveByHand from './resolveByHand/resolveByHand.js'

import credentials from './credentials.js'

import operateHardRAM from './clerks/hardRAMclerk.js'
import operateLS from './clerks/LSclerk.js'

const dataClerks = {hardcodeRAM: operateHardRAM, localStorage: operateLS}

const operateViaDC = getDataClerk()


async function getDataClerk() {
  if (!localStorage.MDS_dataClerk) {
    localStorage.MDS_dataClerk = await resolveByHand(
      'What do we use as a data source?',
      [
        ['localStorage', 'localStorage'],
        ['hardcoded data / RAM', 'hardcodeRAM'],
        ['GlobalVaults', 'globalVault'],
        ['Mongo DB', 'mongoDB'],
        ['MySQL', 'mySQL'],
      ]
    )
  }
  return dataClerks[localStorage.MDS_dataClerk]
}


export default async function operate(action, subject, data) {
  const properOperate = await operateViaDC
  return properOperate(action, subject, data, credentials)

}
