/*
* validate the password for user sign-up
*/
function validate() {

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var pass = document.getElementById('password').value;
    var check = document.getElementById('passwordMatch').value;

    var validUsername = false;
    var validEmail = false;
    var validPassword = false;

    // make sure there is a username
    if(username) {
        document.getElementById('username').style.borderColor = 'green';
        validUsername = true;
    } else {
        document.getElementById('username').style.borderColor = 'red';
        validUsername = false;
    }

    // validate the email
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
        document.getElementById('email').style.borderColor = 'green';
        validEmail = true;
    } else {
        document.getElementById('email').style.borderColor = 'red';
        validEmail = false;
    }

    // validate password
    if (pass == check && pass.length > 7) {
        document.getElementById('password').style.borderColor = 'green';
        document.getElementById('passwordMatch').style.borderColor = 'green';
        validPassword = true;
    } else {
        document.getElementById('password').style.borderColor = 'red';
        document.getElementById('passwordMatch').style.borderColor = 'red';
        validPassword = false;
    }

    // enable submit once all are valid
    if (validPassword && validUsername && validEmail) {
        document.getElementById('submitButton').disabled = false;
    } else {
        document.getElementById('submitButton').disabled = true;
    }
}

/*
* handle user login
*/
function login() {
    var username = $("#username").val();
    var password = $("#password").val();

    // $.post("/loginHash", password, function(result) {
    //     password = result;
    //     console.log('password: ' + result);
    // });

    var params = {
        username: username,
        password: password
    };

    $.post("/login", params, function (result) {
        if (result && result.success) {
            $("#status").text("Successfully logged in.");
            location.replace("dashboard.html");
        } else {
            $("#status").text("Error logging in.");
            console.log("ERROR result: ");
            console.log(result);
        }
    });
}

/*
* handle user logout
*/
function logout() {
    $.post("/logout", function (result) {
        if (result && result.success) {
            $("#status").text("Successfully logged out.");
        } else {
            $("#status").text("Error logging out.");
        }
    });
}

/*
* handle user Registration
*/
function register() {
    var username = $("#username").val();
    var password = $("#password").val();
    var email = $("#email").val();

    var params = {
        username: username,
        password: password,
        email: email
    };

    // pass the new user information to the db
    $.post("/register", params, function (result) {
        if (result && result.success) {
            $("#status").text("Successfully registered user.");
            location.replace("login.html");
        } else {
            $("#status").text("Error registering new user.");
        }
    });
}