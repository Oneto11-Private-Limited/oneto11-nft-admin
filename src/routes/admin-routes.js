const express = require("express");
const adminRouter = express.Router();
const commonHelper = require("../helpers/commonHelper");
const authMdlwr = require("../middleware/authMiddleware");
const settingsSeeds = require("../seeds/settingManagersSeeds");
const themeCtrl = new (require("../controllers/admin/themeController"))();
const fs = require("fs");

module.exports = (app) => {
	app.use("/", adminRouter);

	adminRouter.all(
		"*",
		[authMdlwr.authorizeUser],
		(req, res, next) => themeCtrl.list(req, res, next),
		(req, res, next) => {
			var settings = JSON.parse(
				fs.readFileSync(ROOT_PATH + "/setting.json").toString("utf8"),
			);
			res.locals.layout = "admin/layouts/default";
			res.locals.settings_seeds = settingsSeeds;
			res.locals.configure = settings;
			res.locals.js_files = [];
			res.locals.css_files = [];
			next();
		},
	);
	adminRouter.post("/theme/update", (req, res, next) =>
		themeCtrl.update(req, res, next),
	);

	/* Load plugin from plugins folder here, It will include route.js from plugin folder */
	commonHelper.loadPlugin("admin-users", adminRouter);
	commonHelper.loadPlugin("auction-manager", adminRouter);
	commonHelper.loadPlugin("deal-manager", adminRouter);
	commonHelper.loadPlugin("sell-manager", adminRouter);
	commonHelper.loadPlugin("nft-manager", adminRouter);
	commonHelper.loadPlugin("report-manager", adminRouter);
	commonHelper.loadPlugin("user-manager", adminRouter);
	commonHelper.loadPlugin("contact-manager",adminRouter);
	commonHelper.loadPlugin("cms-manager",adminRouter);
	commonHelper.loadPlugin("social-manager",adminRouter);
	commonHelper.loadPlugin("mynft-manager",adminRouter);

	adminRouter.get("*", (req, res) => {
		res.status(404).send("<h1>404 admin</h1>");
	});
};