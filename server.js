const express = require('express');
const app = express();
const path = require("path");
require('dotenv').config();
//const bcrypt = require('bcrypt'); // used in hashing
const session = require('express-session')

const loginController = require('./controllers/loginController.js');
const logoutController = require('./controllers/logoutController.js');
const hoursController = require('./controllers/hoursController.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.json());                                    // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));            // to support URL-encoded bodies
app.use(express.static(path.join(__dirname, "public")));    // makes public a publicly accessable folder

// set up sessions
app.use(session({
    secret: 'my-super-secret-secret!',
    resave: false,
    saveUninitialized: true
}));

// route for Home-Page
app.get('/', loginController.verifyLogin);

// get
app.get('/hours', loginController.verifyLogin, hoursController.getHours);

// post
app.post('/login',    loginController.handleLogin);
app.post('/logout',   logoutController.handleLogout);
app.post('/register', loginController.register);
//app.post('/loginHash', loginController.hashPassword);

app.post('/timeIn',   loginController.verifyLogin, hoursController.postTimeIn);
app.post('/timeOut', loginController.verifyLogin, hoursController.postTimeOut);

// handle 404 requests
app.use(function (req, res, next) {
    res.status(404).send("Unable to find the requested page")
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

