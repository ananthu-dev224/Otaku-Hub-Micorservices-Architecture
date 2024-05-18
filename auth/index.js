const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('./model/connect')
const userDb = require('./model/user')
require('dotenv').config()
const port = process.env.AUTH_PORT || 3000


app.use(express.json())
db()

app.post('/auth/login', async (req, res) => { //login
    const { email, password } = req.body;
    const user = await userDb.findOne({ email: email })
    if (!user) {
        return res.json({ message: 'Email doesnt exist!' })
    } else {
        const dbPass = user.password
        const passComp = bcrypt.compare(password, dbPass)
        if (!passComp) {
            return res.json({ message: 'Password is Wrong!' })
        }
        const payload = {
            email,
            name: user.name
        }
        jwt.sign(payload, 'secret', (err, token) => {
            if (err) {
                console.log(err)
            } else {
                return res.json({ token: token })
            }
        })
    }
})

app.post('/auth/register', async (req,res) => {
    const {name,email,password} = req.body;
    const existUser = await userDb.findOne({email})
    if(existUser){
        return res.json({message : 'User already exist..please Log in!'})
    }else{
        const salt = 10;
        const hashedPass = await bcrypt.hash(password,salt)
        const newUser = new userDb({
            name,
            email,
            password:hashedPass
        })
        await newUser.save()
        return res.json(newUser)
    }
})

app.listen(port, () => {
    console.log(`Auth Service running at ${port}`)
})