function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCpuChoice() {
    var num = getRandomInt(0, 2);

    switch (num) {
        case 0:
            return "Rock";
        case 1:
            return "Paper";
        default:
            return "Scissors";
    }
}

function getWinner(player, cpu, username) {
    var winner;

    if (player == cpu)
        winner = "tie";
    else if ((player == "Rock" && cpu == "Scissors") || (player == "Scissors" && cpu == "Paper") || (player == "Paper" && cpu == "Rock"))
        winner = username;
    else
        winner = "cpu";

    console.log("winner is " + winner);

    return winner;
}

function playGame(req, res) {

    var player = req.query.player_choice;
    var username = req.query.username;

    var cpu = getCpuChoice();

    var winner = getWinner(player, cpu, username);

    var stuff = { player: player, cpu: cpu, winner: winner }

    res.render('results', stuff);
}

module.exports = { playGame: playGame }