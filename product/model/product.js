const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
     name:String,
     supplier:String,
     price:Number,
     desc:String
})

const product = mongoose.model('product',productSchema)
module.exports = product;