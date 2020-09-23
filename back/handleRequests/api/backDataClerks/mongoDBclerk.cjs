const { MongoClient } = require('mongodb')

const {MDS_MONGO_HOST, MDS_DB_NAME, MDS_DB_USER, MDS_DB_PASS} = process.env

const uri = `mongodb+srv://${MDS_DB_USER}:${MDS_DB_PASS}@${
                MDS_MONGO_HOST}/${MDS_DB_NAME}?retryWrites=true&w=majority`
const options = { useNewUrlParser: true, useUnifiedTopology: true }

let client, mdsDB

connect()


module.exports = [operate, close]


async function operate(action, subject, data, lastTry) {
  try {
    if (!client.isConnected()) throw null
    const db = await mdsDB

    if (`${action} ${subject}` == 'read notes') {
      return await db.collection(subject).find().toArray()
    }
  } catch (err) {
    if (err != null) console.error(err)
    if (lastTry) throw err

    await connect().catch(console.error)
    return operate(action, subject, data, lastTry=true)
  }
}


function connect() {
  return new Promise((resolve, reject) => {
    client = new MongoClient(uri, options)
    mdsDB = client.connect().then(() => {
      resolve()
      return client.db(MDS_DB_NAME)
    }).catch(reject)

    Object.assign(global, {client})
  })
}


async function close() {
  try { await client.close() } catch {}
}
