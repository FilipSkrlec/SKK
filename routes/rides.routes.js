var express = require('express');
var router = express.Router();
const Ride = require('../models/Ride');
const Transporter = require('../models/Transporter')
const Ticket = require('../models/Ticket')
const jwt = require('jsonwebtoken');

router.get('/', authenticateToken, function (req, res, next) {
    (async () => {

        var allRides = await Ride.getAllRides()
        var availableRides = []
        var availableTransportersIds = []
        var availableTransporters = []
        for (var ride of allRides) {
            var transporter = await Transporter.getById(ride.transporter_id)
            ride.transporter = transporter.name
            if (!availableTransportersIds.includes(transporter.transporter_id)) {
                transporter.link = "/rides/" + transporter.transporter_id
                availableTransporters.push(transporter)
                availableTransportersIds.push(transporter.transporter_id)
            }
            var availableSeats = await Ticket.getAvailableTickets(ride.ride_id)
            ride.availableSeats = availableSeats.length
            availableRides.push(ride)
        }

        res.render('rides', {
            title: 'Rides',
            rides: availableRides,
            availableTransporters: availableTransporters,
            user: req.body.user


        })
    })();
});

router.get('/:transporterId', authenticateToken, function (req, res, next) {
    (async () => {

        var allRides = await Ride.getAllRides()
        var availableRides = []
        var availableTransportersIds = []
        var availableTransporters = []
        for (var ride of allRides) {
            var transporter = await Transporter.getById(ride.transporter_id)
            ride.transporter = transporter.name
            if (!availableTransportersIds.includes(transporter.transporter_id)) {
                transporter.link = "/rides/" + transporter.transporter_id
                availableTransporters.push(transporter)
                availableTransportersIds.push(transporter.transporter_id)
            }
            if (ride.transporter_id == req.params.transporterId) {
                var availableSeats = await Ticket.getAvailableTickets(ride.ride_id)
                ride.availableSeats = availableSeats.length
                availableRides.push(ride)
            }

        }

        res.render('rides', {
            title: 'Rides',
            rides: availableRides,
            availableTransporters: availableTransporters,
            user: req.body.user
        })
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