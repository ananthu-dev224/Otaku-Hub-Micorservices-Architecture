const mongoose = require('mongoose')

const auth_db = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/auth-service')
        console.log('Auth DB Connected...')
    } catch (error) {
        console.log('An error occured while connecting to Db in Auth service', error.message)
        process.exit(1)
    }
}

module.exports = auth_db;