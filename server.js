require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//JWT AUT = moved to auth.js
const jwt = require ('jsonwebtoken')

//middleware registration
app.use(express.json());

const posts = [
    {
        username: 'Fabian',
        title: 'Post 1'
    },
    {
        username: 'Alonso',
        title: 'Post 1'
    }
]
// Route for fetching posts //authToken as a middleware
app.get('/posts', authenticateToken, (req,res) => {
    res.json(posts.filter(post => post.username === req.user.name)) //this only returns the post that the user has access to 
})

app.post('/login', (req, res) => {
    //Authenticate User

    const username = req.body.username
    const user = { name: username }
    
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})
})

//middleware to authenticate our TOKEN
function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization'] //this will be in the format of Bearer and then Token
    const token = authHeader && authHeader.split(' ')[1] //if we have an authHeader, then return the authHeader Token portion which we split with ' '
    if (token == null) return res.sendStatus(401) //this way we know if we have not received a token

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) //this is when we received a Token but the Token is no longer valid
        req.user = user //once all the above has been verified, we know we have a valid Token and we know we have a user
        next() //then we go to the next to move on from our middleware
    })
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


app.listen(3000, () => console.log('Server Started'))
