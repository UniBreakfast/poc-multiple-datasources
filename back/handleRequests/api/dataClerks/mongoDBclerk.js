import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { MongoClient } = require('mongodb')

const dbName = process.env.MDS_DB_NAME

const uri = `mongodb+srv://MDS_admin:${process.env.MDS_DB_PASS
  }@cluster0.x0yir.gcp.mongodb.net/${dbName}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
const mdsDB = new MongoClient(uri, options).connect()
                    .then(client => client.db(dbName))

export default async function operate(action, subject, data) {
  const db = await mdsDB.catch(console.log)
  if (`${action} ${subject}` == 'read notes') {
    return db.collection(subject).find().toArray()
  }
}