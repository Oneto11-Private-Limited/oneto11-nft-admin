const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
var document = new Schema(
    {
        likedByUser : {
            type : String,
            required: true,
        },
        likedToNft : {
            type: String,
            required: true,
        },
        date : {
            type: Date, 
            default: () => new Date()
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('nftLike', document, 'nftlikes');