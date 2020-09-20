import resolveByHand from './resolveByHand/resolveByHand.js'

import credentials from './credentials.js'

import operateHardRAM from './dataClerks/hardRAMclerk.js'
import operateLS from './dataClerks/LSclerk.js'
import operateOnBackend from './dataClerks/fetchBackClerk.js'

const dataClerks = {hardcodeRAM: operateHardRAM, localStorage: operateLS,
  backOperations: operateOnBackend}

const operateViaDC = getDataClerk()


async function getDataClerk() {
  if (!localStorage.MDS_dataClerk) {
    const db = await fetch('/api/db_in_use')
                      .then(resp => resp.text()).catch(console.error)

    const choice = await resolveByHand(
      'What do we use as a data source?',
      [
        ['localStorage', 'localStorage'],
        ['hardcoded data / RAM', 'hardcodeRAM'],
        ['GlobalVaults', 'globalVault'],
        [`DB selected on back end (${db})`, 'backOperations'],
        {label: 'mongo DB (need permission)',
          value: {ask: 'mongoDB', set: 'backOperations'}, secure: true},
        {label: 'MySQL (need permission)',
          value: {ask: 'mySQL', set: 'backOperations'}, secure: true},
      ]
    )

    if (choice.permissionKey) {
      const response = await fetch('/api/use_db', {
        method: 'POST',
        body: JSON.stringify({
          clerkName: choice.value.ask,
          permissionKey: choice.permissionKey
        })
      })
      if (response.ok)  localStorage.MDS_dataClerk = choice.value.set
      else  return await getDataClerk()
    } else  localStorage.MDS_dataClerk = choice
  }
  return dataClerks[localStorage.MDS_dataClerk]
}

export default async function operate(action, subject, data) {
  const properOperate = await operateViaDC
  return properOperate(action, subject, data, credentials)

}
