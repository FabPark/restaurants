const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {  //these 3 variables are what we call do check and auth that the user is correct
        const user = getUserByEmail(email)
        if (user == null) {     //if we cannot find the user
            return done(null, false, { message: 'No user with that email' })    //return when there is no user 
        }
        try {
            if (await bcrypt.compare(password, user.password)) {    //password=data entered into the field and user.password=the real password of the user
                return done(null, user)     //this is the good case where the password is correct and the user is returned 
            } else {
                return done(null, false, { message: 'Password incorrect' }) //this is the bad case where the pw does not match
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser)) //the only field above pw is email and authUser is a func above 
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {return done(null, getUserById(id))})

}

module.exports = initialize;
