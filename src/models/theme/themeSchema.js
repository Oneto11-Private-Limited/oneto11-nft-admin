const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var document = new Schema(
    {
        key: { type: String, required: true },
        value: { type: String, required: true }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('Theme', document, 'theme');