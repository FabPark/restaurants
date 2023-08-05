require('dotenv').config()

if (process.env.NODE_ENV !== 'production') {    //this will load all our environment variables and set them inside of dotenv
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


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

//moved to authServer
// app.post('/login', (req, res) => {
//     //Authenticate User

//     const username = req.body.username
//     const user = { name: username }
    
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET) //this TOKEN has no expiration time 
//     res.json({ accessToken: accessToken})
// })
//moved to authServer

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

//passport login system


const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    email => users.find(user => user.email === email),   //function for finding the user based on the email
    id => users.find(user => user.id === id) 
    )

const users = [] //this is just hardcoded instead of making a DB 

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false })) //we can access the data entered in the field through req(middleware) in our app.post method
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,               // we don't want to resave our session variables if nothing is changed
    saveUninitialized: false    //we don't want to save an empty value if there is no value
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {        //checkAuthenticated middleware will work first to redirect wrong users to login page
    res.render('index.ejs', { name: req.user.name})
})

app.get('/login', checkNotAuthenticated, (req, res) => {        //checkNotAuthenticated middleware to make sure logged in ppl stay logged in
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {      //checkNotAuthenticated middleware to make sure logged in ppl stay logged in
    successRedirect: '/',       //goes to homepage
    failureRedirect: '/login',  //failure go back to login
    failureFlash: true          //failure get msg in passport-config depending on their error
}))

app.get('/register', checkNotAuthenticated, (req, res) => {     //checkNotAuthenticated middleware to make sure logged in ppl stay logged in
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {      //checkNotAuthenticated middleware to make sure logged in ppl stay logged in
   try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10) //hashed 10 times
    users.push({
        id: Date.now().toString(), //if we have a db this would already be generated
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    res.redirect('/login') //redirected here if all the above is successful
   } catch {
    res.redirect('/register') //if there is a failure, they go back to register
   }
    console.log(users) //check to see if there is a new user
})

app.delete('/logout', checkAuthenticated, (req, res, next) => {           //npm i method-override => bc HTML forms can only do get and post. patch, put, delete needs to be overrided with post => https://medium.com/@codeyourthoughts48/allhttp-requests-using-html-forms-fdb09a49258f
    req.logOut((err) => {                                               //passport already has logOut function 
        return next(err);                       //need this bc req.logout is asynchronous
})                                
    res.redirect('/login')                      //after logging out, goes to login page
})

function checkAuthenticated(req, res, next) {   //this is a middleware to check for authentication and protect the main page so that only those logged in can see the main page
    if (req.isAuthenticated()) {
        return next()                           //if user is authenticated, proceed to main page w/ logout option
    }

    res.redirect('/login')              //if not logged in, the user can only see the login page now
}

function checkNotAuthenticated(req, res, next) {   //this is a middleware to allow logged in people to stay logged in
    if (req.isAuthenticated()) {
        return res.redirect('/')            //this will redirect all logged in to the main page even when trying to go to the other pages
    }

    next()          //if they are not authenticated, then the call is continued
}

//passport login system

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
