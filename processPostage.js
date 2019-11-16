function getPrice(weight, type) {

    if (type == "Letter (stamped)") {

        var price = 0.55 + .15 * (weight - 1);

        return (Math.round(price * 100) / 100).toFixed(2);

    } else if (type == "Letter (metered)") {

        if (weight < 1)
            return 0.50;
        else if (weight < 2)
            return 0.65;
        else if (weight < 3)
            return 0.80;
        else if (weight < 3.5)
            return 0.95;
        else
            return "Invalid Weight";

    } else if (type == "Large Envelope") {

        var price = 1.00 + .15 * (weight - 1);

        return (Math.round(price * 100) / 100).toFixed(2);

    } else if (type == "First-Class Package") {

        if (weight < 4)
            return 3.66;
        else if (weight < 8)
            return 4.39;
        else if (weight < 12)
            return 5.19;
        else if (weight < 13)
            return 5.71;
        else
            return "Invalid Weight";

    }
}

function calculatePostage(req, res) {

    var weight = req.query.weight;
    var type = req.query.mail_type;

    var price = getPrice(weight, type);

    var stuff = { weight: weight, type: type, price: price }

    res.render('postageResults', stuff);
}

module.exports = { calculatePostage: calculatePostage }