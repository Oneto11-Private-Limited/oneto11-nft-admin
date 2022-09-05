const adminUsersSchema = require('./adminUsersSchema');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const Validator = require('validatorjs');



module.exports = class AdminUser extends adminUsersSchema {
    registerNewUser(data) {
        return new Promise((resolve, reject) => {
            data.password = bcrypt.hashSync(data.password, salt);
            var newUserEntity = new adminUsersSchema(data);
            newUserEntity.save().then(args => resolve(args)).catch(err => reject(err));
        })
    }
    validatePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }

    update(requestData, file) {

        const validation = new Validator(requestData, {
            name: 'required',
            email: 'required',
            username: 'required'
        });
        return new Promise((resolve, reject) => {
            if (validation.fails()) {
                reject(validation.errors);
            }
            if(file){
                requestData['profile_picture'] = file.filename;
            }else {
                delete requestData['profile_picture'];
            }
            adminUsersSchema.findOneAndUpdate({ _id:requestData._id}, {$set:requestData}, {new:true})
                .then(args => resolve(args)).catch(err =>reject(err) );
        })
    }

    updatePassword(requestData) {        
        const validation = new Validator(requestData, {
            password: 'required|confirmed',
            password_confirmation:'required',            
        });

        return new Promise((resolve, reject) => {
            if (validation.fails()) {                
                reject(validation.errors);
            }else {                
                const password = bcrypt.hashSync(requestData.password, salt);
                adminUsersSchema.findOneAndUpdate({ _id:requestData._id}, {$set:{password:password,reset_password_token:null}})
                    .then(args => resolve(args)).catch(err =>reject(err) );
            }            
        })
    }
}

