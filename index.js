const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 5000

var server = app.listen(PORT, () => console.log(`Server started`))

// router setup
const homeRouter = require('./routes/home.routes');
const ridesRouter = require('./routes/rides.routes')
const registrationRouter = require('./routes/registration.routes')
const buyRouter = require('./routes/buy.routes')
const profileRouter = require('./routes/profile.routes')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


// router setup
app.use('/', homeRouter);
app.use('/rides', ridesRouter);
app.use('/registration', registrationRouter);
app.use('/buy', buyRouter);
app.use('/profile', profileRouter);

module.exports = server;