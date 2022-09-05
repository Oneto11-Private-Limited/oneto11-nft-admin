const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var conversationSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: 'User', is_admin: Boolean, join_date: Date }],
    created_by_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    is_group: Boolean,
    left_by_user_ids: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    updated_at: Date,
    created_at: Date
});

conversationSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

module.exports = mongoose.model('Conversation', conversationSchema);