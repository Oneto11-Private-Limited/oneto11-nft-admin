const reportCtrl = new (require("../controllers/admin/reportController"))();
const { upload } = require("../../../helpers/commonHelper");

module.exports = (parentRoutes) => {
	parentRoutes.get("/report-manager", (req, res, next) =>
		reportCtrl.index(req, res, next),
	);
	parentRoutes.get("/report-manager/list", (req, res, next) =>
		reportCtrl.listAndSearch(req, res, next),
	);
	parentRoutes.get("/report-manager/add", (req, res, next) =>
		reportCtrl.add(req, res, next),
	);
	parentRoutes.get("/report-manager/edit/:id", (req, res, next) =>
		reportCtrl.edit(req, res, next),
	);
	parentRoutes.post(
		"/report-manager/update",
		upload.single("profile_picture"),
		(req, res, next) => reportCtrl.update(req, res, next),
	);
	parentRoutes.get("/report-manager/view/:id", (req, res, next) =>
		reportCtrl.view(req, res, next),
	);
	parentRoutes.get("/report-manager/delete/:id", (req, res, next) =>
		reportCtrl.delete(req, res, next),
	);
};
