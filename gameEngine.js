function getRandomInt(min, max) {
    return Math.floor(Math.random() * (min - max + 1)) + min;
}

function getCpuChoice() {
    var num = getRandomInt(0, 2);

    switch (num) {
        case 0:
            return "rock";
        case 1:
            return "paper";
        default:
            return "scissors";
    }
}

function getWinner(player, cpu, username) {
    var winner;

    if (player == cpu)
        winner = "tie";
    else if ((player == "rock" && cpu == "scissors")
        || (player == "scissors" && cpu == "paper")
        || (player == "paper" && cpu == "rock"))
        winner = username;
        else 
        winner = cpu;

        return winner;
}

function playGame(req, res) {
    var player = req.query.player_choice;
    var username = req.query.username;

    var cpu = getCpuChoice();

    var winner = getWinner(player, cpu, username);

    var stuff = {player: player, cpu: cpu, winner: winner}

    res.render('results', stuff);


    console.log("the player choice is " + player);
    console.log("the player choice is " + cpu);
}

module.exports = { playGame: playGame }