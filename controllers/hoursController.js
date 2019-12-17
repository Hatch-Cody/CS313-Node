const hoursModel = require("../models/hoursModel.js");

/*******************
* get the total number of hours
*******************/
function getHours(req, res) {
    console.log('hoursController | recieved a request for: ' + req.url);
    const user = req.session.user

    hoursModel.getAllHours(user, function (error, results) {
        if (error) {
            console.log("An error occurred in hoursController");
            console.log(error);
            result = { success: false };
            res.json(result);

        } else {
            res.json(results);
        }
    });
}

/*******************
* add to the total number of hours
*******************/
function postTimeIn(req, res) {
    //const timeIn = req.body.timeIn;
    const user = req.session.user;
    var result = { success: false };

    hoursModel.postTimeIn(user, function (error, results) {
        if (error) {
            console.log("An error occurred in the DB Controller");
            console.log(error);
            result = { success: false, results };
            res.json(result);

        } else {
            console.log("No Errors");
            result = { success: true, results };
            res.json(result);
        }
    });
}

/*******************
* post the daily time instance
*******************/
function postTimeOut(req, res) {
    const user = req.session.user;

    hoursModel.postTimeOut(user, function (error, results) {
        if (error) {
            console.log("An error occurred in the DB Controller");
            console.log(error);
            result = { success: false };
            res.json(result);

        } else {
            console.log("No Errors");
            result = { success: true };
            res.json(result);
        }
    });
}

module.exports = {
    getHours: getHours,
    postTimeIn: postTimeIn,
    postTimeOut: postTimeOut
};