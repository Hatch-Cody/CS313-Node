const express = require('express');
var gameEngine = require('./gameEngine.js');
var app = express();

app.set('port', 5000);
app.use(express.static(__dirname + '/public')); // allows public to be public?
app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');
app.get('/', function(req, res){
    res.sendFile('form.html', { root:__dirname + "/public" });
});
app.get('/game', gameEngine.playGame);
app.listen(app.get('port'), function() {
    console.log('Listening on port ' + app.get('port'));
})