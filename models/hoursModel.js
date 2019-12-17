const { Pool } = require("pg");
var async = require("async");
const connectionString = process.env.DATABASE_URL || "postgres:DATABASE_URL='postgres://goeypdkadrxduh:327642ad3e9ef95c812930e959a453ea3c9aecba9f9d9fe7a8ce30e5f870615f@ec2-23-21-129-125.compute-1.amazonaws.com:5432/d24d6m55cc4on5?ssl=true'";

const pool = new Pool({ connectionString: connectionString });

/*******************
* get all the time instances
*******************/
function getAllHours(user, callback) {
    console.log("hoursModel | getAllHours()");

    const params = [user];

    const sql = 'SELECT (time_in, time_out) FROM users WHERE username = $1 RETURNING *';

    // run the query
    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);

        } else {
            console.log('Successfully set timeIn')
            console.log(result.rows)

            callback(null, result.rows);
        }
    });
}

/*******************
* post the current days clockIn time
*******************/
function postTimeIn(user, callback) {
    console.log("hoursModel | posting timeIn...");

    const timeIn = getTime();

    console.log("timeIn: " + getTimeFromSeconds(timeIn));

    params = [user, timeIn];

    console.log("params: " + params);

    //const sql = 'SELECT time_in, concat(time_in, $2) time_in FROM users WHERE username = $1';
    //const sql = 'UPDATE users SET time_in = time_in || ' + ", " + ' || $2 FROM users WHERE username = $1'; 
    const sql = 'UPDATE users SET time_in = $2 WHERE  username = $1 RETURNING time_in';

    // run the query
    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);

        } else {
            console.log('Successfully set timeIn')
            console.log(result.rows)

            callback(null, result.rows);
        }
    });
}

/*******************
* post the current days clockOut time
* send daily time instance to the db
*******************/
function postTimeOut(user, callback) {
    console.log("hoursModel | postTimeOut()");

    const timeOut = getTime();

    console.log("timeOut: " + getTimeFromSeconds(timeOut));

    var params = [user, timeOut];

    console.log("params: " + params);

    const sql = 'UPDATE time_out || $2 FROM users WHERE username = $1'; 
    //const sql = 'UPDATE users SET time_in = time_in || { 2, 3 } ::int[]';
    //const sql = 'UPDATE users SET time_in = $2 WHERE  username = $1';

    // This runs the query, and then calls the callback function with the results.
    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);

        } else {
            console.log('Successfully set time instance')

            callback(null, result);
        }
    });



}

/*******************
* post the total number of hours
*******************/
function postHours(callback) {

}

/*******************
* get the timeIn instance from the db
*******************/
function dailyTimeIn(name) {
    console.log("getting timeIn instance from db...");

    const sql = 'SELECT time_in FROM users WHERE username = $1';
    const params = [name];

    // This runs the query, and then calls the callback function with the results.
    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query getting timeIn from db: ")
            console.log(err);
            callback(err, null);

        } else {
            console.log('Successfully queried time_in')
            console.log(result.rows[0].time_in)

            return result.rows[0].time_in;
        }
    });
}

/*
* get the time since Jan 1 1970
*/
function getTime() {
    var t = new Date();
    return t.getTime();
}

/*
* convert seconds to H:M:S format
*/
function getTimeFromSeconds(seconds) {

    seconds = parseInt(seconds);
    var time = new Date(seconds);

    console.log(time);

    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();

    return hour + ':' + minute + ':' + second;
}

module.exports = {
    getAllHours: getAllHours,
    postTimeIn: postTimeIn,
    postTimeOut: postTimeOut,
    postHours: postHours,
    dailyTimeIn: dailyTimeIn
};