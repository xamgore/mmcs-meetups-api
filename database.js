import lowdb from 'lowdb'
import fileAsyncStorage from 'lowdb/lib/storages/file-async'

const db = lowdb('db.json', {
  storage: fileAsyncStorage,
  format: { serialize: o => JSON.stringify(o, null, 2) }
})

db.defaults({ events: [] }).write()

export default db
