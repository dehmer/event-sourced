
const populate = db => {
  db.put(journal('POI', aggregateA, now()), { type: 'created', name: 'AA - ALPHA', latlng: { lat: 48.692, lng: 15.221 } })
  db.put(journal('POI', aggregateA, now()), { type: 'moved', latlng: { lat: 48.698, lng: 15.231 } })
  db.put(journal('POI', aggregateA, now()), { type: 'moved', latlng: { lat: 48.711, lng: 15.282 } })
  db.put(journal('POI', aggregateA, now()), { type: 'moved', latlng: { lat: 48.732, lng: 15.312 } })
  db.put(journal('POI', aggregateA, now()), { type: 'property-changed', name: 'comment', value: 'XYZ' })
  db.put(journal('POI', aggregateA, now()), { type: 'property-changed', name: 'comment', value: 'ABC' })
  db.put(journal('POI', aggregateA, now()), { type: 'property-changed', name: 'comment', value: 'WXY' })
  db.put(journal('POI', aggregateA, now()), { type: 'property-changed', name: 'name', value: 'AA - A' })
  db.put(journal('POI', aggregateA, now()), { type: 'moved', latlng: { lat: 48.812, lng: 15.453 } })
  db.put(journal('POI', aggregateA, now()), { type: 'moved', latlng: { lat: 48.891, lng: 15.571 } })

  db.put(journal('POI', aggregateB, now()), { type: 'created', name: 'AA - BRAVO', latlng: { lat: 49.692, lng: 14.221 } })
  db.put(journal('POI', aggregateB, now()), { type: 'property-changed', name: 'name', value: 'AA - B' })
  db.put(journal('POI', aggregateB, now()), { type: 'property-changed', name: 'comment', value: '123' })
  db.put(journal('POI', aggregateB, now()), { type: 'property-changed', name: 'comment', value: '456' })
  db.put(journal('POI', aggregateB, now()), { type: 'property-changed', name: 'comment', value: '789' })
}

const clean = db => {
  const deleteStream = options => {
    const batch = db.batch()
    const key = (options && options.key) || (chunk => chunk)

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

  db.createReadStream().pipe(deleteStream({ key: chunk => chunk.key }))
}

module.exports = {
  populate,
  clean
}