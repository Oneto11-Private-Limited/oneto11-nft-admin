const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema
var document = new Schema(
    {
        email : {
            type : String,
            required: true,
        },
        fullName : {
            type: String,
            required: true,
        },
        country : {
            type: String,
            required: true,
        },
        subject : {
            type: String,
            required: true,
        },
        message : {
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

module.exports = mongoose.model('contactUs', document, 'contactus');