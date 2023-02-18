#!/usr/bin/env node
const uuid = require('uuid-random')
const store = require('./poi-store')

store.on('created', event => console.log('created', store.state()))
store.on('moved', event => console.log('moved', store.state()))
store.on('ready', state => {
  console.log('state', state)
  const aggregate = uuid()
  store.create(aggregate, { name: 'AA - ALPHA', latlng: { lat: 48.692, lng: 15.221 } })
  store.move(aggregate, { lat: 48.698, lng: 15.231 })
  store.move(aggregate, { lat: 48.732, lng: 15.312 })
})
