const User = require('../models/User')

exports.home = function(req, res) {
    let user = new User('John', 25, "john7@gmail.com");
    user.testing();
}