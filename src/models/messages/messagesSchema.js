const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
    conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender_user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: string },
    read_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    deleted_by: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    attachments: [],
    created_at: Date,
    updated_at: Date
});

messageSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});

module.exports = mongoose.model('Message', messageSchema);