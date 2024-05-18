const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    products: Array,
    user: String,
    total: Number,
    orderedAt: {
        type: Date,
        default: Date.now()
    }
})

const order = mongoose.model('order', orderSchema)

module.exports = order;