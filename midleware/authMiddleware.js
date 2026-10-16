const jwt = require ('jsonwebtoken');
const User = require ('../models/user');
const config = require('../config');

var JWT_SECRET = config.db.JWT_SECRET;

const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify (token, JWT_SECRET, (err,decodedToken) =>{
            if (err){
                console.log(err.message);
                res.redirect ('/login');
            } else {
                console.log(decodedToken);
                next();
            }
        });
    }else {
        console.log ('redirecting to Login Page');
        res.redirect ('/login');
    }
}

//check who is using
const checkUser = (req, res, next) =>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify (token, JWT_SECRET, async (err,decodedToken) =>{
            // if there is error in verification
            if (err){
                res.locals.email = null;
                next();
            } else {
                // Async callback: a throw here is an unhandled rejection, which exits Node.
                // A deleted user or a Mongo error must not take down every GET.
                try {
                    let user = await User.findById(decodedToken.id);
                    res.locals.email = user ? user.email : null;
                } catch (error) {
                    console.error(error);
                    res.locals.email = null;
                }
                next();
            }
        });
    }
    // If there is no tokern
    else {
        res.locals.email = null;
        next();
    }
}

module.exports = {requireAuth, checkUser};