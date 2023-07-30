require('dotenv').config()

const express = require('express')
const app = express()
const router = express.Router() //=> Al = GOD bc he told me to put router in every single file

//can't make this route work,......

//JWT AUT
// const jwt = require ('jsonwebtoken');
// app.use(express.json());

// const posts = [
//     {
//         username: 'Fabian',
//         title: 'Post 1'
//     },
//     {
//         username: 'Alonso',
//         title: 'Post 1'
//     }
// ]

// Route for fetching posts
// app.get('/posts', (req,res) => {
//     res.json(posts)
// })

//login route
// app.post('/login', (req, res) => {
//     //Authenticate User
//     const username = req.body.username
//     const user = { name: username }
    
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//     res.json({ accessToken: accessToken})
// })
//JWT AUT

module.exports = router;
