const mongoose = require('mongoose');
const themeSchema = require('./themeSchema');
const Validator = require('validatorjs');

module.exports = class Theme extends themeSchema {
    listAll(args) {
        return new Promise((resolve, reject) => {
            themeSchema.find().then(result => {
                resolve(result)
            }).catch(e => reject(e));
        })
    }
    insertOrUpdate(requestData) {
        let validation = new Validator(requestData, {
            key: 'required',
            value: 'required'
        });

        if (validation.passes()) {
            return new Promise((resolve, reject) => {
                if (requestData.key.indexOf('reset') > -1) {
                    var key = requestData.key.split(':');
                    key = typeof key[1] != 'undefined' ? key[1] : false;
                    if (requestData.value == 'all') {
                        themeSchema.deleteMany({}).then(res => resolve({refresh:true})).catch(err => reject(err));
                    } else if (key) {
                        requestData.key = key;
                        themeSchema.findOneAndUpdate({ key: key }, requestData, { upsert: true, new: true, runValidators: true }).then(res => resolve({refresh:true})).catch(err => reject(err));
                    } else {
                        themeSchema.deleteMany({ key: requestData.value }).then(res => resolve({refresh:true})).catch(err => reject(err));
                    }
                } else {
                    themeSchema.findOneAndUpdate({ key: requestData.key }, requestData, { upsert: true, new: true, runValidators: true }).then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    });
                }
            })
        } else {
            return new Promise((resolve, reject) => {
                reject(validation.errors);
            });
        }
    }
}


