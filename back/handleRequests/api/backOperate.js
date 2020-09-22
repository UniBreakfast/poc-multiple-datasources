import fs from 'fs'
const fsp = fs.promises

import { createRequire } from 'module'
const require = createRequire(import.meta.url)



export const dataClerks = {
  mongoDB: () => require('./dataClerks/mongoDBclerk.cjs'),
  mySQL: () => require('./dataClerks/mySQLclerk.cjs'),
}

let operateViaDC, fireOldDC

assignDataClerk()


export async function assignDataClerk(clerkName) {
  if (clerkName) {
    if (clerkName == process.env.MDS_db_in_use) return

    if (! (clerkName in dataClerks))
      return console.error('Unknown data clerk name')

    process.env.MDS_db_in_use = clerkName

    updateConfig(clerkName)

    await fireOldDC()
  }

  if (!process.env.MDS_db_in_use)
    process.env.MDS_db_in_use = Object.keys(dataClerks)[0]

  ;[operateViaDC, fireOldDC] = dataClerks[process.env.MDS_db_in_use]()
}


export function operate(action, subject, data, credentials) {
  return operateViaDC(action, subject, data)
}


async function updateConfig(clerkName) {
  const path = process.cwd()+'/config.js'
  const config = String(await fsp.readFile(path))
  await fsp.writeFile(path, config
                    .replace( /(MDS_DB_IN_USE: ')\w*(',)/ , `$1${clerkName}$2`))
}