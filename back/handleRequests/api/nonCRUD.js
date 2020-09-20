import {dataClerks, assignDataClerk} from './backOperate.js'

export default {
  db_in_use(_, resp) {
    resp.end(process.env.MDS_DB_IN_USE)
  },
  use_db(_, resp, {clerkName, permissionKey}) {
    if (permissionKey == process.env.MDS_ADMIN_KEY && clerkName in dataClerks) {
      process.env.MDS_DB_IN_USE = clerkName
      assignDataClerk()
      resp.end(`Granted. Server switched to ${clerkName}`)
    } else {
      resp.statusCode = 403
      resp.end('Denied. Incorrect permission key or unavailable clerk')
    }
  },
}