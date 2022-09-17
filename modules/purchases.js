const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
    customer_id : {type: Number},
    year: {type: Number},
    month: {type: Number},
    product_id : {type: Number},
    product_name : {type: String},
    quantity : {type: Number},
    total_sum: {type: Number}
});

const Purchase = mongoose.model('purchases', PurchaseSchema);
module.exports = Purchase;