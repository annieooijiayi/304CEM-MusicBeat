const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    user_name: {type: String},
    user_email: {type: String},
    user_password: {type: String}
});

const User = mongoose.model('users', userSchema);

module.exports = User;
