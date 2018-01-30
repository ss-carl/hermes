const express = require('express')
const request = require('request-promise-native')
const winston = require('winston')

const router = express.Router()

router.get('/call-google', (req, res) => {
  request
    .get('https://google.com')
    .then((r) => {
      res.send(r)
    })
    .catch((e) => {
      winston.error(e)
      res.status(500).send(e)
    })
})

router.get('/generate-401', (req, res) => res.status(401).send())
router.get('/generate-500', (req, res) => res.status(500).send())

router.get('/generate-error', () => {
  throw new Error('generated error')
})

module.exports = router
