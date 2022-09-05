const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
var document = new Schema(
    {
        displayName : {
            type : String,
            required: true,
            unique: true
        },
        email : {
            type: String,
            required: true,
            unique: true
        },
        password : {
            type: String,
            required: true
        },
        bio : {
            type : String,
            required : true
        },
        profileImage : {
            type : String,
            required : true
        },
        socialMedia : {
            type : Object
        },
        notification : {
            type : Object
        },
        date : {
            type: Date, 
            default: new Date()
        },
        updateTime :{
            type: Date
        },
        
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

module.exports = mongoose.model('Userdb', document, 'userdbs');