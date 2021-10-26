const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discountSchema = new Schema({

    discountCode: { // AS = alta stagione, BS = bassa stagione, F = festività, N = normale
        type: String,
        required: true
    },
    discountSign: {
        type: String,
        required: true
    },
    discountRate: {
        type: Number,
        required: true
    }
});

const discount = mongoose.model('discount', discountSchema);
module.exports = discount;
