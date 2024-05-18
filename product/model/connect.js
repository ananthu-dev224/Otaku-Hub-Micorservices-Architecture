const mongoose = require('mongoose')

const product_db = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/product-service')
        console.log('Product DB Connected...')
    } catch (error) {
        console.log('An error occured while connecting to Db in Product service', error.message)
        process.exit(1)
    }
}

module.exports = product_db;