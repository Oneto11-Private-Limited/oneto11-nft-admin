const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var document = new Schema(
    {
        name: { type: String, required: true },
        content: { type: String },
        slug: {type: String, required: true},
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('CmsPages', document, 'cms_pages');