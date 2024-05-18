const express = require('express')
const app = express()
const { connectRabbitmq, getChannel } = require('./services/amqp')
const db = require('./model/connect')
const productDb = require('./model/product')
const auth_mw = require('../auth_middleware')
require('dotenv').config()
const port = process.env.PRODUCT_PORT || 3001


app.use(express.json())
db()
connectRabbitmq()




app.post('/product/add', auth_mw, async (req, res) => {
    const { name, supplier, desc, price } = req.body;
    const newProduct = new productDb({
        name,
        supplier,
        desc,
        price
    })

    await newProduct.save()
    return res.json(newProduct)
})

app.post('/product/buy', auth_mw, async (req, res) => {
    try {
        const { ids } = req.body;
        console.log(ids)
        const products = await productDb.find({ _id: { $in: ids } })
        const channel = getChannel()
        channel.sendToQueue(
            'ORDER',
            Buffer.from(JSON.stringify({
                products,
                email: req.user.email
            }))
        )
        
        return res.json({message:'Order placed successfully!'})
    } catch (error) {
        console.error('An error at buy product',error.message)
        return res.json(error)
    }
})


app.listen(port, () => {
    console.log(`Product Service running at ${port}`)
})