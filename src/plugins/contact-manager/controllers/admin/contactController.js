const path = require("path");
const contactModel = require("../../models/contactModel");
var viewPath = path.join(__dirname, "../../views");
const mongoose = require("mongoose");
const {
	respond,
	getEmailTemplate,
	generateRandomString,
} = require("../../../../helpers/commonHelper");
const moment = require("moment");

module.exports = class contactController {
	constructor() {
		this.contactModel = new contactModel();
	}

	index = (req, res) => {
		res.render(viewPath + "/contact/index", {
			misc: { route_name: "contact-manager", title: "Contacts" },
		});
	};

	listAndSearch = async (req, res) => {
		var list = await this.contactModel.listAll(req.query);
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

	


	view = async (req, res) => {
		var result = await contactModel.findOne({ _id: req.params.id });
		res.render(viewPath + "/contact/view", {
			misc: { route_name: "contact-manager", title: "View Contact" },
			result,
		});
	};

	

	delete = async (req, res) => {
		try {
			const result = await this.contactModel.deteteById(
				new mongoose.Types.ObjectId(req.params.id),
			);
			res.redirect("/contact-manager");
		} catch (err) {
			req.flash("error", err.message);
			res.redirect("/contact-manager");
		}
	};
};
