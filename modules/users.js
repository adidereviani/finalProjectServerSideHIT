const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    id : {type: Number},
    first_name : {type: String},
    last_name : {type: String},
    product_list : {type: Array}
});

const User = mongoose.model('users', UserSchema);
module.exports = User;