const mongoose = require('mongoose')

const order_db = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/order-service')
        console.log('Order DB Connected...')
    } catch (error) {
        console.log('An error occured while connecting to Db in Order service', error.message)
        process.exit(1)
    }
}

module.exports = order_db;