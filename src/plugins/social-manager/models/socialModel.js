const socialSchema = require('./socialSchema');
const Validator = require('validatorjs');
const slugify = require('slugify');

module.exports = class cmsPages extends socialSchema {

    userTimezone = DEFAULT_TIMEZONE;
    constructor(option) {
        super();
        if (typeof option != 'undefined' && option.hasOwnProperty('userTimezone')) {
            this.userTimezone = option.userTimezone;
        }
    }

    listAll(args) {
        return new Promise((resolve, reject) => {
            var where = {};
            if (args.q) {
                where = { "name": { $regex: new RegExp('^.*' + args.q + '.*', "i") } };
            }
            socialSchema.countDocuments(where).then(count => {
                var response = { count: count, result: [] };
                if (count > 0) {
                    var offset = (args.page - 1) * ITEMS_PER_PAGE;
                    socialSchema.aggregate([
                        { $match: where },
                        { $sort: { created_at: -1 } },
                        { $skip: offset },
                        { $limit: ITEMS_PER_PAGE },
                        {
                            $project: {
                                name: 1, link: 1,
                                created_at: { $dateToString: { format: FORMAT_24HRS, date: "$created_at", timezone: this.userTimezone } },
                                updated_at: { $dateToString: { format: FORMAT_24HRS, date: "$updated_at", timezone: this.userTimezone } }
                            }
                        }]).then(result => {
                            response['result'] = result;
                            resolve(response)
                        }).catch(e => reject(e));
                } else {
                    resolve(response);
                }
            }).catch(err => reject(err));
        })
    }
    insertOrUpdate(requestData) {
        let validation = new Validator(requestData, {
            name: 'required'
        });

        if (validation.passes()) {
            if (typeof requestData.id != 'undefined') {
                return new Promise((resolve, reject) => {
                    socialSchema.updateOne({ _id: requestData.id }, requestData).then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    });
                })
            } else {
                return new Promise((resolve, reject) => {
                    requestData['slug'] = slugify(requestData.name, { lower: true });
                    socialSchema.insertMany(requestData).then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    });
                })
            }
        } else {
            return new Promise((resolve, reject) => {
                reject(validation.errors);
            });
        }
    }
}


