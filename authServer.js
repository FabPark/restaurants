require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//JWT AUT = moved to auth.js
const jwt = require ('jsonwebtoken')

//middleware registration
app.use(express.json());

let refreshTokens = [] //for production, need to make an entire db to store tokens

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401) //error msg if no token
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) //error msg if refreshToken is not valid anymore
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => { //verify the refreshToken
        if (err) return res.sendStatus(403)                                     //check error
        const accessToken = generateAccessToken({ name: user.name })            //just get the user.name because user object has much more info
        res.json({ accessToken: accessToken})
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.post('/login', (req, res) => {
    //Authenticate User

    const username = req.body.username
    const user = { name: username }
    
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) //need a refresh bc of the expiration
    refreshTokens.push(refreshToken)
    res.json({ accessToken: accessToken, refreshToken: refreshToken})
})

//middleware to authenticate our TOKEN //this is no longer needed in authServer
// function authenticateToken (req, res, next) {
//     const authHeader = req.headers['authorization'] //this will be in the format of Bearer and then Token
//     const token = authHeader && authHeader.split(' ')[1] //if we have an authHeader, then return the authHeader Token portion which we split with ' '
//     if (token == null) return res.sendStatus(401) //this way we know if we have not received a token

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403) //this is when we received a Token but the Token is no longer valid
//         req.user = user //once all the above has been verified, we know we have a valid Token and we know we have a user
//         next() //then we go to the next to move on from our middleware
//     })
// }

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'} )
}
//JWT AUT

//this connects to mongoose
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))



//route registration
const restaurantsRouter = require('./routes/restaurants')
// const authRouter = require('./routes/auth'); //don't know how to make this work

app.use('/restaurants', restaurantsRouter);
// app.use('/auth', authRouter); //don't know how to make this work

//two different servers, JWT tokens still work bc all the info is in the token 
app.listen(4000, () => console.log('Server Started'))
