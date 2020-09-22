import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { MongoClient } = require('mongodb')

const {MDS_DB_NAME, MDS_DB_USER, MDS_DB_PASS} = process.env

const uri = `mongodb+srv://${MDS_DB_USER}:${MDS_DB_PASS
  }@cluster0.x0yir.gcp.mongodb.net/${MDS_DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

let client, mdsDB

function connectToMongo() {
  return new Promise((resolve, reject) => {
    client = new MongoClient(uri, options)
    mdsDB = client.connect().then(() => {
      resolve()
      return client.db(MDS_DB_NAME)
    }).catch(reject)

    Object.assign(global, {client})
  })
}

export default async function operate(action, subject, data, lastTry) {
  try {
    const db = await mdsDB

    if (`${action} ${subject}` == 'read notes') {
      return await db.collection(subject).find().toArray()
    }
  } catch (err) {
    console.error(err)
    if (lastTry) throw err

    await connectToMongo().catch(console.error)
    return operate(action, subject, data, lastTry=true)
  }
}
