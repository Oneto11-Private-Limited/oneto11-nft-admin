const reportSchema = require("./reportSchema");
const Validator = require("validatorjs");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const slugify = require("slugify");

module.exports = class User extends reportSchema {
	userTimezone = DEFAULT_TIMEZONE;
	constructor(option) {
		super();
		if (typeof option != "undefined" && option.hasOwnProperty("userTimezone")) {
			this.userTimezone = option.userTimezone;
		}
	}

	listAll(args) {
		return new Promise((resolve, reject) => {
			var where = { deleted: { $eq: null } };
			if (args.q) {
				where["nftId"] = { $regex: new RegExp("^.*" + args.q + ".*", "i") };
			}
			reportSchema
				.countDocuments(where)
				.then((count) => {
					var response = { count: count, result: [] };

					if (count > 0) {
						var offset = (args.page - 1) * ITEMS_PER_PAGE;
						reportSchema
							.aggregate([
								{ $match: where },
								{ $sort: { created_at: -1 } },
								{ $skip: offset },
								{ $limit: ITEMS_PER_PAGE },
								{
									$project: {
										userId: {
											$toObjectId: "$userId",
										},
										nftId: 1,
										reason: 1,
										date: 1,
										comments: 1,
									},
								},
								{
									$lookup: {
										from: "userdbs",
										localField: "userId",
										foreignField: "_id",
										as: "users",
									},
								},
								{
									$unwind: "$users",
								},
								{
									$project: {
										nftId: 1,
										reason: 1,
										date: 1,
										comments: 1,
										displayName: "$users.displayName",
										email: "$users.email",
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

	validatePassword(password, hash) {
		return bcrypt.compareSync(password, hash);
	}

	registerNewUser(request) {
		let validation = new Validator(request, {
			email: "required|email",
			password: "required|min:6",
		});

		return new Promise((resolve, reject) => {
			if (validation.fails()) reject(validation.errors);
			request["password"] = bcrypt.hashSync(request.password, salt);
			request["status"] = true;
			request["username"] = request.email; //slugify(request.name, { lower: true });
			reportSchema
				.insertMany(request)
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	updatePassword(requestData) {
		return new Promise((resolve, reject) => {
			requestData["password"] = bcrypt.hashSync(requestData.password, salt);
			reportSchema
				.updateOne({ _id: requestData._id }, requestData)
				.then((res) => {
					resolve(res);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	insertOrUpdate(requestData) {
		let validator = {
			name: "required",
			email: "required|email",
			username: "required|alpha_num",
		};
		if (typeof requestData._id == "undefined") {
			validator["password"] = "required|min:6";
		}
		let validation = new Validator(requestData, validator);
		if (validation.passes()) {
			if (typeof requestData._id != "undefined") {
				requestData.gender = requestData.gender;
				return new Promise((resolve, reject) => {
					reportSchema
						.updateOne({ _id: requestData._id }, requestData)
						.then((res) => {
							resolve(res);
						})
						.catch((err) => {
							reject(err);
						});
				});
			} else {
				return new Promise((resolve, reject) => {
					if (typeof requestData._id != "undefined") {
						requestData["password"] = bcrypt.hashSync(
							requestData.password,
							salt,
						);
					}
					reportSchema
						.insertMany(requestData)
						.then((res) => {
							resolve(res);
						})
						.catch((err) => {
							if (err.errmsg.includes("duplicate")) {
								var mySubString = err.errmsg.substring(
									err.errmsg.lastIndexOf("{") + 1,
									err.errmsg.lastIndexOf(":"),
								);
								mySubString = mySubString.trim();
								if (mySubString) {
									var temp = {};
									temp[mySubString] = [
										"this " + mySubString + " already exists in system",
									];
									errRes = { errors: temp };
								} else {
									var errRes = err.errmsg;
								}
							}
							reject(errRes);
						});
				});
			}
		} else {
			return new Promise((resolve, reject) => {
				reject(validation.errors);
			});
		}
	}
};
