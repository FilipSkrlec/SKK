var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('../models/User');
require('dotenv').config()

router.get('/', authenticateToken, function (req, res) {

    res.render('home', {
        title: 'Home',
        err: undefined,
        user: req.body.user
    })
});

router.post('/login', authenticateToken, async function (req, res) {

    if (req.user == undefined) {
        var dbUser = await User.getByEmail(req.body.email)
        if (dbUser.email === undefined) {
            res.render('home', {
                title: 'Home',
                err: 'Korisnički račun s navedenim podacima ne postoji!',
                user: undefined
            })
        } else {
            bcrypt.compare(req.body.password, dbUser.password, function (err, result) {
                if (result == false) {
                    res.render('home', {
                        title: 'Home',
                        err: 'Korisnički račun s navedenim podacima ne postoji!',
                        user: undefined

                    })
                } else {
                    var user = {
                        email: dbUser.email,
                        firstname: dbUser.firstname,
                        lastname: dbUser.lastname
                    }
                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                    res.cookie('jwt', accessToken, {
                        maxAge: 60 * 10 * 1000,
                        httpOnly: false
                    })
                    res.render('home', {
                        title: 'Home',
                        err: undefined,
                        user: user
                    })
                }
            });
        }
    } else {
        res.redirect('/')
    }
})

router.post('/logout', authenticateToken, async function (req, res) {

    if (req.body.user != undefined) {
        res.clearCookie('jwt');
    }
    res.redirect('/')
})

function authenticateToken(req, res, next) {

    var jwtCookie = undefined
    if(req.headers.cookie != undefined) {

        splitCookies = req.headers.cookie.split('; ')
        for(var cookie of splitCookies) {
            currentCookie = cookie.split('=')
            if(currentCookie[0] == 'jwt') {
                jwtCookie = currentCookie[1]
                break
            }
        }
    }
    if (jwtCookie != undefined) {
        jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                req.body.user = undefined
                next()
            } else {
                req.body.user = user
                next()
            }
        })
    } else {
        req.body.user = undefined
        next()
    }
}

module.exports = router;