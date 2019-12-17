
/*
* get the time instance for when the user clocks-in
* and send it to the db
*/
function timeIn() {

    $.post("/timeIn", function (result) {
        console.log("clientSide result: ");
        console.log(result);
        if (result && result.success) {
            for (var i = 0; i < result.results.length; i++) {
                $("#table").append('<tr> <th>' + getTimeFromSeconds(result.results[i].time_in) + 
                '</th> <th>' + getTimeFromSeconds(result.results[i].time_in) + '</th> </tr>');
                console.log(result.results[0]);
            }
        } else {
            $("#table").append('<tr> <th>Date</th> <th>Time-In</th> <th>Time-Out</th> </tr>');
        }
    });
}

/*
* get the time instance for when the user clocks-out
* and send it to the db
*/
function timeOut() {

    $.post("/timeOut", function (result) {
        if (result && result.success) {
            $("#status").text("Successfully clocked in.");
        } else {
            $("#status").text("Error clocking in.");
        }
    });

}

/*
* display the live time to the dashboard
*/
function displayTime() {
    var today = new Date();
    var year = (today.getYear() - 100) + 2000;
    var month = today.getMonth()
    var day = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();
    var amPm = '';

    minute = checkTimeFormat(minute);
    second = checkTimeFormat(second);

    // convert to 12 hour format
    if (hour > 12) {
        hour = hour - 12;
        amPm = 'PM';
    }
    else
        amPm = 'AM';

    // convert int to name of month
    switch (month) {
        case 0:
            month = 'January';
            break;
        case 1:
            month = 'February';
            break;
        case 2:
            month = 'March';
            break;
        case 3:
            month = 'April';
            break;
        case 4:
            month = 'May';
            break;
        case 5:
            month = 'June';
            break;
        case 6:
            month = 'July';
            break;
        case 7:
            month = 'August';
            break;
        case 8:
            month = 'September';
            break;
        case 9:
            month = 'October';
            break;
        case 10:
            month = 'November';
            break;
        case 11:
            month = 'December';
            break;
    }

    // display date
    document.getElementById('date').innerHTML =
        month + ' ' + day + ', ' + year;

    // display time
    document.getElementById('clock').innerHTML =
        hour + ':' + minute + ':' + second + ' ' + amPm;

    var t = setTimeout(displayTime, 500);
}

/*
* fix formatting for time under 10 seconds
*/
function checkTimeFormat(i) {
    // add zero in front of numbers < 10
    if (i < 10) { i = '0' + i };
    return i;
}

/*
* convert seconds to H:M:S format
*/
function getTimeFromSeconds(seconds) {

    seconds = parseInt(seconds);
    var time = new Date(seconds);

    console.log(time);

    var hour = checkTimeFormat(time.getHours());
    var minute = checkTimeFormat(time.getMinutes());
    var second = checkTimeFormat(time.getSeconds());

    if (hour > 12) {
        hour = hour - 12;
        amPm = 'PM';
    }
    else
        amPm = 'AM';

    return hour + ':' + minute + ':' + second + " " + amPm;
}

/*
* calculate the time that the user has worked
*/
function calculateTimeWorked(secondsIn, secondsOut) {

    var secondsWorked = (secondsOut - secondsIn) / 1000;

    var hours = Math.floor(secondsWorked / 3600);
    var minutes = Math.floor((secondsWorked - ((hours * 60) * 60)) / 60);
    var seconds = Math.round(secondsWorked - ((minutes * 60) + ((hours * 60) * 60)));

    seconds = checkTimeFormat(seconds);

    console.log('after convert to seconds: ' + hours + ':' + minutes + ':' + seconds)

    return hours + ':' + minutes + ':' + seconds;
}

/*
* get the time since Jan 1 1970
*/
function getTime() {
    var t = new Date();
    return t.getTime();
}

/*
* clear the data from the db for the start of a new pay period
*/
function clearData() {
    //db.removeItem('TCDaily_time');
    //db.removeItem('TCClock_in');
}

/*
* get the hours from the db and show in the table
*/
function showHours() {

    $.post("/timeIn", function (result) {
        console.log("clientSide result: ");
        console.log(result);
        if (result && result.success) {
            for (var i = 0; i < result.results.length; i++) {
                $("#table").append('<tr> <th>' + getTimeFromSeconds(result.results[i].time_in) + 
                '</th> <th>' + getTimeFromSeconds(result.results[i].time_in) + '</th> </tr>');
                console.log(result.results[0]);
            }
        } else {
            console.log("clientSide result: ");
            console.log(result);
        }
    });

    var allTimeJson = "";

    $.post("/getHours", function (result) {
        if (result && result.success) {
            allTimeJson = userTimeWorked;
        } else {
            $("#status").text("Error loading time worked.");
        }
    });

    // parse into object
    allTimeJson = JSON.parse(allTimeJson);

    // change table HTML to show hours
    var heading = '<tr><th>Date</th><th>Time-In</th><th>Time-Out</th></tr>';

    for (var key in allTimeJson) {
        if (allTimeJson.hasOwnProperty(key)) {
            //console.log(key + " -> " + allTimeJson[key]);
        }
        console.log(key + " -> " + allTimeJson[key]);
    }

}

