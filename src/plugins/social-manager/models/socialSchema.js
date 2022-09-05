const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var document = new Schema(
    {
        name: { type: String, required: true },
        link: { type: String },
        
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('socials', document, 'socials');