const express = require('express')
const bodyParser = require('body-parser')
const uuid = require('uuid')
const Memcached = require('memcached-promisify')
const logger = require('morgan')

const db = require('./db.json')
const memcached = new Memcached({'cacheHost': 'mc-demo.slmnwu.0001.usw1.cache.amazonaws.com:11211'})
const app = express()
const router = express.Router()

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  res.status(200).json({ data: {
    message: {
      title: 'start',
      role: 'zeta'
    }
  }})
})

router.get('/secrets', (req, res, next) => {
  memcached.get('databag')
  .then(data => {
    if (data === undefined) {
      console.log('memcached miss')
      const key = {
        date: Date.now(),
        token: uuid.v4()
      }
      memcached.set('databag', key, 120)
      .catch(e => console.log(e))
      return key
    } else {
      console.log('found: ', data) 
      return data
    }
    
  })
  .then(resData => {
    res.status(200).json({resData})
  })
  .catch(e => console.log('error:', e))
})

router.get('/user/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);
  const user = db.users.find(u => u.id === userId)
  return res.status(200).json(user)
})

app.use('/', router)
app.listen(4000, () => {
  console.log('Listening on port: 4000')
})
