const path = require("path");
const reportModel = require("../../../report-manager/models/reportModel");
const reportSchema = require("../../../report-manager/models/reportSchema");
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
		this.reportModel = new reportModel();
	}

	index = (req, res) => {
		res.render(viewPath + "/reports/index", {
			misc: { route_name: "report-manager", title: "Reports" },
		});
	};

	listAndSearch = async (req, res) => {
		var list = await this.reportModel.listAll(req.query);
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
		res.render(viewPath + "/reports/add", {
			misc: { route_name: "report-manager", title: "Add User" },
		});
	};

	edit = (req, res) => {
		res.locals.css_files = [
			"https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
			"/public/css/image-upload.css",
		];
		reportSchema
			.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(req.params.id),
						deleted: { $eq: null },
					},
				},
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
						displayName: "$users.displayName",
						email: "$users.email",
						comments: 1,
					},
				},
			])
			.exec((error, result) => {
				if (error) res.redirect("/report-manager");
				const response = result[0];
				res.render(viewPath + "/reports/edit", {
					misc: { route_name: "report-manager", title: "Edit Report" },
					response,
					moment: moment,
				});
			});
	};

	view = async (req, res) => {
		reportSchema
			.aggregate([
				{
					$match: {
						_id: new mongoose.Types.ObjectId(req.params.id),
						deleted: { $eq: null },
					},
				},
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
						displayName: "$users.displayName",
						email: "$users.email",
						comments: 1,
					},
				},
			])
			.exec((error, result) => {
				if (error) res.redirect("/report-manager");
				const response = result[0];
				res.render(viewPath + "/reports/view", {
                    misc: { route_name: "report-manager", title: "View Report" },
                    response,
                });
			});
		
	};

	update = (req, res) => {
		let data = req.body;
		req.body.status = req.body.status || false;
		if (typeof req.file === "undefined") {
			delete data["profile_picture"];
		} else {
			data["profile_picture"] = req.file.filename;
		}
		this.reportModel
			.insertOrUpdate(data)
			.then((result) => {
				let msg = "User added successfully";
				let redirect = "/admin/report-manager";
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

	delete = (req, res) => {
		console.log("req.params.id", req.params.id);
		reportSchema
			.updateOne(
				{ _id: new mongoose.Types.ObjectId(req.params.id) },
				{ $set: { deleted: true } },
			)
			.then((result) => {
				if (result) {
					req.flash("success", "Report deleted successfully");
				} else {
					req.flash("error", "No report found");
				}
				res.redirect("/report-manager");
			})
			.catch((err) => {
				req.flash("error", err.message);
				res.redirect("/report-manager");
			});
	};
};
