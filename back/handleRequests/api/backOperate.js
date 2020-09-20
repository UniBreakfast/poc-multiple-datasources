import operateMongo from './dataClerks/mongoDBclerk.js'
import operateMySQL from './dataClerks/mySQLclerk.js'

export const dataClerks = {mongoDB: operateMongo, mySQL: operateMySQL}

let operateViaDC

assignDataClerk()

export function assignDataClerk() {
  if (!process.env.MDS_db_in_use)
    process.env.MDS_db_in_use = Object.keys(dataClerks)[0]

  operateViaDC = dataClerks[process.env.MDS_db_in_use]
}

export function operate(action, subject, data, credentials) {
  return operateViaDC(action, subject, data)
}
