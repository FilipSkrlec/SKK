var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const User = require('../models/User');

router.get('/', function (req, res, next) {
    res.render('registration', {
        title: 'Registration',
        err: undefined
    })
});

router.post('/', authenticateToken, function (req, res, next) {
    (async () => {
        if (req.body.user == undefined) {
            var checkUser = await User.getByEmail(req.body.email)
            if (checkUser.email !== undefined) {
                res.render('registration', {
                    title: 'Registration',
                    err: 'Korisnik s navedenom email adresom je već registriran!'
                })
            } else {
                const salt = await bcrypt.genSalt(saltRounds);
                var hash = await bcrypt.hash(req.body.password, salt);
                var newUser = new User(req.body.email, req.body.firstname, req.body.lastname, hash);
                var enterUser = await User.enterNewUser(newUser);
                if (enterUser == true) {
                    res.render('home', {
                        title: 'Home',
                        err: "Uspješna registracija. Možete se prijaviti u sustav!",
                        user: undefined
                    });
                } else {
                    res.render('registration', {
                        title: 'Registration',
                        err: 'Dogodila se pogreška!'
                    });
                }
            }
        } else {
            res.render('registration', {
                title: 'Registration',
                err: 'Prvo se morate odjaviti'
            });
        }

    })();
});

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