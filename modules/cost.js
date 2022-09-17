const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CostSchema = new Schema({
    product_id : {type: Number},
    name : {type: String},
    description : {type: String},
    category : {type: String},
    sum : {type: Number}
});

const Cost = mongoose.model('costs', CostSchema);
module.exports = Cost;