const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres:DATABASE_URL='postgres://goeypdkadrxduh:327642ad3e9ef95c812930e959a453ea3c9aecba9f9d9fe7a8ce30e5f870615f@ec2-23-21-129-125.compute-1.amazonaws.com:5432/d24d6m55cc4on5?ssl=true'";

const pool = new Pool({ connectionString: connectionString });

function handleLogin(name, pass, callback) {

    console.log('Logging in a user...');

    const sql = 'SELECT username, password FROM users WHERE username = $1';
    const params = [name];

    // This runs the query, and then calls the callback function with the results.
    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);

        } else if (result.rows == "") {
            error = "Invalid username or password";
            callback(error, null);

        } else {
            console.log('Successfully queried user')

            if (result.rows[0].username == name && result.rows[0].password == pass) {

                callback(null, result.rows);

            } else {
                error = "Invalid username or password";

                callback(null, result);
            }
        }
    });
}

function registerUser(params, callback) {
    console.log('Registering new user...');

    const sql = 'INSERT INTO users(username, password, email) VALUES($1, $2, $3)'; // RETURNING *';

    // This runs the query, and then calls the callback function with the results.
    pool.query(sql, params, function (err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);

        } else {
                callback(null, result);
        }
    });

}

module.exports = {
    handleLogin: handleLogin,
    registerUser: registerUser
};
