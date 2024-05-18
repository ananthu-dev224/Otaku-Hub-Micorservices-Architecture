const orderDb = require('../model/order')

const createOrder = async ({products,email}) => {
    let total = 0;
    for(let product of products){
        total+=product.price
    }
    const newOrder = new orderDb({
        products,
        user:email,
        total,
    })
    await newOrder.save()
    return newOrder
}


module.exports = {
    createOrder
}