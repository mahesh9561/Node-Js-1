const Person = require('./model/person');
const LocalStrategy = require('passport-local').Strategy;  //username and password Stategy
const passport = require('passport');

// Authentication
passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        console.log("Recieve candidates : ", username, password);
        const user = await Person.findOne({ username: username });
        if (!user) {
            return done(null, false, { message: "Incorrect username" })
        }
        const isPassword = user.password === password ? true : false;
        if (isPassword) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Incorrect password" })
        }
    } catch (error) {
        return done(error)
    }
}))

module.exports = passport