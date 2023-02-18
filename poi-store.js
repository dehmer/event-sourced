const EventEmitter = require('events')
const now = require('nano-time')
const { db, clear } = require('./db')

clear()

let state = {}
let busy = false
let queue = []

const evented = new EventEmitter()
const emit = evented.emit.bind(evented)

const handlers = {
  'created': ({ uuid, ...poi }) => state[uuid] = poi,
  'moved': ({ uuid, latlng }) => state[uuid] = { ...state[uuid], latlng }
}

const reduce = (type, event) => (handlers[type] || (() => {}))(event)
const execute = command => busy ? (queue = [...queue, command]) : command()

db.createReadStream({
  keys: false,
  gte: `journal:poi`,
  lte: `journal:poi\xff`,
})
.on('data', ({ type, ...event }) => reduce(type, event))
.on('error', err => evented.emit('error', err))
.on('end', () => { /* don't care */ })
.on('close', () => evented.emit('ready', { ...state }))

// Applying the event AFTER it was persisted is pretty pessimistic and
// makes it necessary to serialize pending writes and commands.

const persist = (type, event) => callback => {
  busy = true // Queue new commands while busy.
  db.put(`journal:poi:${now()}`, { type, ...event }).then(() => {
    reduce(type, event)
    callback(type, event)

    // Check for queued commands:
    const [head, ...tail] = queue
    head ? head() : (busy = false)
    queue = tail
  }).catch(err => evented.emit('error', err))
}

evented.state = () => ({ ...state })

evented.create = (uuid, poi) => execute(() => {
  persist('created', { uuid, ...poi })(emit)
})

evented.move = (uuid, { lat, lng }) => execute(() => {
  if (!state[uuid]) return /* nothing to move */
  persist('moved', { uuid, latlng: { lat, lng }})(emit)
})

module.exports = evented