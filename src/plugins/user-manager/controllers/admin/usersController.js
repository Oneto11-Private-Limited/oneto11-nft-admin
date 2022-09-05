const path = require("path");
const userModel = require("../../models/userModel");
var viewPath = path.join(__dirname, "../../views");
const mongoose = require("mongoose");
const {
	respond,
	getEmailTemplate,
	generateRandomString,
} = require("../../../../helpers/commonHelper");
const moment = require("moment");

module.exports = class usersController {
	constructor() {
		this.userModel = new userModel();
	}

	index = (req, res) => {
		res.render(viewPath + "/users/index", {
			misc: { route_name: "user-manager", title: "Users" },
		});
	};

	listAndSearch = async (req, res) => {
		var list = await this.userModel.listAll(req.query);
		if (list.result) {
			var response = respond(true, "success", {
				total_record: list.count,
				result: list.result,
			});
		} else {
			var response = respond(false, "result not found");
		}
    
		res.json(response);
	};

	add = (req, res) => {
		res.locals.css_files = [
			"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
			"/public/css/image-upload.css",
		];
		res.render(viewPath + "/users/add", {
			misc: { route_name: "user-manager", title: "Add User" },
		});
	};

	edit = (req, res) => {
		res.locals.css_files = [
			"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
			"/public/css/image-upload.css",
		];
		userModel
			.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(req.params.id),
					},
				},
				{
					$lookup: {
						from: "user_destinations",
						localField: "_id",
						foreignField: "user_id",
						as: "destinations",
					},
				},
			])
			.exec((error, result) => {
				const response = result[0];
				res.render(viewPath + "/users/edit", {
					misc: { route_name: "user-manager", title: "Edit User" },
					response,
					moment: moment,
				});
			});
	};

	view = async (req, res) => {
		var result = await userModel.findOne({ _id: req.params.id });
		res.render(viewPath + "/users/view", {
			misc: { route_name: "user-manager", title: "View User" },
			result,
		});
	};

	update = (req, res) => {
		let data = req.body;
		// req.body.status = req.body.status || false;
		let userObject = {
			displayName: data.displayName,
			email: data.email,
			_id: data._id,
			profileImage: data.profileImage,
		};
		if (typeof req.file === "undefined") {
			delete userObject["profileImage"];
		} else {
			userObject["profileImage"] = req.file.filename;
		}
		console.log({ userObject });
		this.userModel
			.insertOrUpdate(userObject)
			.then((result) => {
				let msg = "User added successfully";
				let redirect = "/user-manager";
				if (req.body.id) {
					msg = "User updated successfully";
					redirect = false;
				}
				var response = respond(true, msg, { result, redirect });
				res.json(response);
			})
			.catch((err) => {
				var msg = typeof err == "string" ? err : "Please input correctly";
				var response = respond(false, msg, {}, err.errors);
				res.json(response);
			});
	};

	delete = async (req, res) => {
		try {
			const result = await this.userModel.deteteById(
				new mongoose.Types.ObjectId(req.params.id),
			);
			res.redirect("/user-manager");
		} catch (err) {
			req.flash("error", err.message);
			res.redirect("/user-manager");
		}
	};
};
