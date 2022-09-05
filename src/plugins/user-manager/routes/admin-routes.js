const userCtrl = new (require("../controllers/admin/usersController"))();
const { upload } = require("../../../helpers/commonHelper");

module.exports = (parentRoutes) => {
	parentRoutes.get("/user-manager", (req, res, next) =>
		userCtrl.index(req, res, next),
	);
	parentRoutes.get("/user-manager/list", (req, res, next) =>
		userCtrl.listAndSearch(req, res, next),
	);
	parentRoutes.get("/user-manager/add", (req, res, next) =>
		userCtrl.add(req, res, next),
	);
	parentRoutes.get("/user-manager/edit/:id", (req, res, next) =>
		userCtrl.edit(req, res, next),
	);
	parentRoutes.post(
		"/user-manager/update",
		upload.single("profile_picture"),
		(req, res, next) => userCtrl.update(req, res, next),
	);
	parentRoutes.get("/user-manager/view/:id", (req, res, next) =>
		userCtrl.view(req, res, next),
	);
	parentRoutes.get("/user-manager/delete/:id", (req, res, next) =>
		userCtrl.delete(req, res, next),
	);
};
