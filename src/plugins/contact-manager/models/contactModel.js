const contactSchema = require("./contactSchema");
const Validator = require("validatorjs");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const slugify = require("slugify");

module.exports = class Contact extends contactSchema {
	userTimezone = DEFAULT_TIMEZONE;
	constructor(option) {
		super();
		if (typeof option != "undefined" && option.hasOwnProperty("userTimezone")) {
			this.userTimezone = option.userTimezone;
		}
	}

	listAll(args) {
		return new Promise((resolve, reject) => {
			var where = { deleted_at: { $eq: null } };
			if (args.q) {
				where["email"] = {
					$regex: new RegExp("^.*" + args.q + ".*", "i"),
				};
			}
			contactSchema
				.countDocuments(where)
				.then((count) => {
					var response = { count: count, result: [] };

					if (count > 0) {
						var offset = (args.page - 1) * ITEMS_PER_PAGE;
						contactSchema
							.aggregate([
								{ $match: where },
								{ $sort: { data: -1 } },
								{ $skip: offset },
								{ $limit: ITEMS_PER_PAGE },
								{
									$project: {
										fullName: 1,
										email: 1,
										subject: 1,
										message: 1,
										date: 1,
										
									},
								},
								{ $sort : { date : -1 } }
							])
							.then((result) => {
								response["result"] = result;
								resolve(response);
							})
							.catch((e) => reject(e));
					} else {
						resolve(response);
					}
				})
				.catch((err) => reject(err));
		});
	}

	

	deteteById(id) {
		return contactSchema
			.deleteOne({
				_id: id,
			})
			.then((result) => {
				return result;
			})
			.catch((err) => {
				return err;
			});
	}
};
