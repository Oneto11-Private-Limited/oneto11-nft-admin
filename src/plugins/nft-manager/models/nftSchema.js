const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
var document = new Schema(
    {
        
        NftId : {
            type : Number,
            required: true
        },
        ipfs : {
            type : String,
            required: true
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('NFT', document, 'nfts');