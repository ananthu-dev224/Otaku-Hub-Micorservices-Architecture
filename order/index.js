const express = require('express')
const app = express()
const {connectRabbitmq,getChannel,consumeQueue} = require('./services/amqp')
const db = require('./model/connect')
const orderDb = require('./model/order')
const auth_mw = require('../auth_middleware')
require('dotenv').config()
const port = process.env.ORDER_PORT || 3002


app.use(express.json())
db()

connectRabbitmq().then(consumeQueue)



app.listen(port, () => {
    console.log(`Order Service running at ${port}`)
})