var express = require('express');
var router = express.Router();
const Ride = require('../models/Ride');
const Transporter = require('../models/Transporter')
const Ticket = require('../models/Ticket')
const jwt = require('jsonwebtoken');

router.get('/', authenticateToken, function (req, res) {
    (async () => {
        if (req.body.user != undefined) {
            var userTickets = await Ticket.getUserTickets(req.body.user.email)
            var userRidesIds = []
            var userRides = []
            for (var ticket of userTickets) {
                userRidesIds.push(ticket.ride_id)
            }

            for (var id of userRidesIds) {
                var ride = await Ride.getById(id)
                userRides.push(ride)
            }

            for (var ride of userRides) {
                var transporter = await Transporter.getById(ride.transporter_id)
                ride.transporter = transporter.name
            }

            res.render('profile', {
                title: 'Profile',
                tickets: userTickets,
                rides: userRides,
                user: req.body.user,
                err: undefined

            })
        } else {
            res.redirect('/rides')
        }
    })();
});

router.post('/cancel', authenticateToken, function (req, res) {
    (async () => {
        if (req.body.user != undefined) {

            var cancel = await Ticket.cancelTicket(req.body.ticketId)
            res.redirect('/profile')

        } else {
            res.redirect('/rides')
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