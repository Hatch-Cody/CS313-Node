/*
* user logout
*/
function handleLogout(request, response) {
    var result = { success: false };

    // We should do better error checking here to make sure the parameters are present
    if (request.session.user) {
        request.session.destroy();
        result = { success: true };
    }

    response.json(result);
}

module.exports = {
    handleLogout: handleLogout
};