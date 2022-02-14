var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const Transporter = require('../models/Transporter');
const Ride = require('../models/Ride');
const Ticket = require('../models/Ticket')
require('dotenv').config()

router.get('/:rideId', authenticateToken, function (req, res) {
    (async () => {
        if (req.body.user != undefined) {
            var ride = await Ride.getById(req.params.rideId)
            var availableTickets = await Ticket.getAvailableTickets(req.params.rideId)
            var currentTicket = availableTickets[0]
            var transporter = await Transporter.getById(ride.transporter_id)
            ride.transporter = transporter.name

            res.render('buy', {
                title: 'buy',
                err: undefined,
                ride: ride,
                currentTicket: currentTicket,
                user: req.body.user,
                buyingAvailable: true
            })
        } else {
            res.redirect('/rides')
        }

    })();
});

router.post('', authenticateToken, function (req, res) {
    (async () => {
        if (req.body.user != undefined) {
            var currentTicket = await Ticket.getById(req.body.ticketId)
            var ride = await Ride.getById(currentTicket.ride_id)
            var transporter = await Transporter.getById(ride.transporter_id)
            ride.transporter = transporter.name

            var bought = await Ticket.buyTicket(req.body.user.email, currentTicket.ticket_id)
            if(bought == true) {
                res.render('buy', {
                    title: 'buy',
                    err: "Karta uspješno kupljena",
                    ride: ride,
                    currentTicket: currentTicket,
                    user: req.body.user,
                    buyingAvailable: false
                })
            } else {
                res.render('buy', {
                    title: 'buy',
                    err: "Pokušaj kupnje karte nije uspio. Molimo pokušajte ponovno.",
                    ride: ride,
                    currentTicket: currentTicket,
                    user: req.body.user,
                    buyingAvailable: false
                }) 
            }
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