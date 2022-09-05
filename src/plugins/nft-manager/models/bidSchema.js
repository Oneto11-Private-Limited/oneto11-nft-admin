const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var document = new Schema(
    {
    bidder: {
        type: String,
        required: true,
    },
    nftId: {
        type: Number,
        required: true,
    },
    txHash: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    txTime: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        default: () => new Date()
    }

})


module.exports = mongoose.model('bidevent', document, 'bidevents');
