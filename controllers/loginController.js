const loginModel = require("../models/loginModel.js");

var crypto = require('crypto');
const { Pool, Client } = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://ta_user:ta_pass@localhost:5000/";

const pool = new Pool({ connectionString: connectionString });

/*******************
* user login
*******************/
function handleLogin(req, res) {
    var result = { success: false };

    var name = req.body.username;
    var pass = req.body.password;

    loginModel.handleLogin(name, pass, function (error, results) {
        if (error) {
            console.log("An error occurred in the DB Controller");
            console.log(error);
            result = { success: false };
            res.json(result);

        } else {
            req.session.user = req.body.username;
            console.log("Login Successful");
            result = { success: true };
            res.json(result);
        }
    });
}

/*******************
* Verify user login
*******************/
function verifyLogin(req, res, next) {
    if (req.session.user) {
        // They are logged in!

        console.log("Login Controller: user is logged in");
        var result = { success: true };

        // pass things along to the next function
        next();
    } else {
        // They are not logged in
        // Send back an unauthorized status
        var result = { success: false, message: "Access Denied, log in or create an account" };
        console.log(result);
        res.redirect("login.html");
        //res.status(401).json(result);
    }
}

/*******************
* register a new user and pass the new 
* information to the db
*******************/
function registerUser(req, res, callback) {
    var result = { success: false };

    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;

    const params = [username, password, email];

    loginModel.registerUser(params, function (error, results) {
        if (error) {
            console.log("An error occurred in the DB Controller");
            console.log(error);
            result = { success: false };
            res.json(result);

        } else {
            req.session.user = req.body.username;
            console.log("No Errors");
            result = { success: true };
            res.json(result);
        }
    });
}

module.exports = {
    handleLogin: handleLogin,
    verifyLogin: verifyLogin,
    //hashPassword: saltHashPassword,
    register: registerUser
};




/*******************
* Salt and Hash the users password
*******************/
// function saltHashPassword(userpassword) {  
//     var salt = genRandomString(16);     /** Gives us salt of length 16 */
//     var passwordData = hash(userpassword, salt);
//     console.log('UserPassword = ' + userpassword);
//     console.log('Passwordhash = ' + passwordData.passwordHash);
//     console.log('nSalt = ' + passwordData.salt);
// }

// function genRandomString(length) {
//     return crypto.randomBytes(Math.ceil(length / 2))
//         .toString('hex')        /** convert to hexadecimal format */
//         .slice(0, length);      /** return required number of characters */
// };

// function hash(password, 
//     ) {
//     var hash = crypto.createHmac('sha512', salt);   /** Hashing algorithm sha512 */
//     console.log('hash: ' + hash);
//     hash.update(password);
//     var value = hash.digest('hex');
//     return {
//         salt: salt,
//         passwordHash: value
//     };
// };

