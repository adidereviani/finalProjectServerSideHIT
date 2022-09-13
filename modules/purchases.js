const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
    customer_id : {type: Number},
    product_id : {type: Number},
    quantity : {type: Number}
});

const Purchase = mongoose.model('purchases', PurchaseSchema);
module.exports = Purchase;