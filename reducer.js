
const replay = reducer => {
  db.createReadStream({
    gte: `${reducer.key}`,
    lte: `${reducer.key}\xff`,
    keys: true
  }).pipe(replayStream(reducer.reduce))
}

const poi = key => {
  const xs = {}
  return {
    key,
    model: () => xs,
    reduce: (uuid, { type, ...argv }) => {
      switch (type) {
        case 'created': xs[uuid] = argv; break
        case 'moved': xs[uuid].latlng = argv.latlng; break
        case 'property-changed': xs[uuid][argv.name] = argv.value; break
      }

      console.log('model', xs)
    }
  }
}

const comments = () => {
  const xs = {}
  return {
    key: 'journal:POI',
    model: () => xs,
    reduce: (uuid, { type, ...argv }) => {
       switch (type) {
        case 'created': xs[uuid] = { name: argv.name, comments: argv.comment || []}; break
        case 'property-changed': if (argv.name === 'comment') xs[uuid].comments.push(argv.value); break
      }

      console.log('comments', xs)
    }
  }
}

// replay(poi('journal:POI'))
// replay(poi(`journal:POI:${aggregateA}`))
replay(comments())
