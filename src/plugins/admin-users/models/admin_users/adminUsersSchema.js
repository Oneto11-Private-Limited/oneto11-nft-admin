const mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema(
    {
        name: String,
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {type: Number, required: true, enum:[1,2]}, //1=admin
        profile_picture : {type: String },
        reset_password_token: {type: String },
        timezone: {type: String },
        status: {type: Boolean, required: true},
        deleted_at : {type: Date, default: null } 
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('AdminUser', userSchema, 'admin_users');