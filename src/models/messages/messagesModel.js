const mongoose = require('mongoose');
const User = require('./usersSchema');

module.exports = {
    registerNewUser: (data) => {
        return new Promise((resolve, reject) => {
            var newUserEntity = new User(data);
            newUserEntity.save().then(res => resolve(res)).catch(err => reject(err));
        })
    }
}