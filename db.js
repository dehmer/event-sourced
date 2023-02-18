const { Writable } = require('stream')
const level = require('level')

const db = level('db', { valueEncoding: 'json' })

const deleteStream = () => {
  const batch = db.batch()
  return new Writable({
    objectMode: true,
    write (chunk, _, callback) {
      batch.del(key(chunk))
      callback()
    },
    final (callback) {
      batch.write(callback)
    }
  })
}

const clear = () => db.createReadStream({ values: false }).pipe(deleteStream())

module.exports = {
  db,
  clear
}