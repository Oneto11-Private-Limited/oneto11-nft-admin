const cmsPagesSchema = require('./cmsPagesSchema');
const Validator = require('validatorjs');
const slugify = require('slugify');

module.exports = class cmsPages extends cmsPagesSchema {

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
            cmsPagesSchema.countDocuments(where).then(count => {
                var response = { count: count, result: [] };
                if (count > 0) {
                    var offset = (args.page - 1) * ITEMS_PER_PAGE;
                    cmsPagesSchema.aggregate([
                        { $match: where },
                        { $sort: { created_at: -1 } },
                        { $skip: offset },
                        { $limit: ITEMS_PER_PAGE },
                        {
                            $project: {
                                name: 1, meta_title: 1, meta_description: 1, content: 1, slug: 1, status: 1,
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
                    cmsPagesSchema.updateOne({ _id: requestData.id }, requestData).then(res => {
                        resolve(res);
                    }).catch(err => {
                        reject(err);
                    });
                })
            } else {
                return new Promise((resolve, reject) => {
                    requestData['slug'] = slugify(requestData.name, { lower: true });
                    cmsPagesSchema.insertMany(requestData).then(res => {
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


