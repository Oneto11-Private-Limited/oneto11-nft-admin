const adminUserCtrl = new (require("../controller/adminUsersController"))();
const { upload } = require("../../../helpers/commonHelper");

module.exports = (parentRoutes) => {
	parentRoutes.get("/", (req, res, next) =>
		adminUserCtrl.index(req, res, next),
	);
	parentRoutes.post("/login", (req, res, next) =>
		adminUserCtrl.login(req, res, next),
	);
	parentRoutes.get("/dashboard", (req, res, next) =>
		adminUserCtrl.dashboard(req, res, next),
	);
	parentRoutes.get("/profile", (req, res, next) =>
		adminUserCtrl.myAccount(req, res, next),
	);
	parentRoutes.post(
		"/update-profile",
		upload.single("profile_picture"),
		(req, res, next) => adminUserCtrl.updateProfile(req, res, next),
	);
	parentRoutes.post("/register", (req, res, next) =>
		adminUserCtrl.registerAdminUser(req, res, next),
	);
	parentRoutes.post("/change-password", (req, res, next) =>
		adminUserCtrl.changePassword(req, res, next),
	);
	parentRoutes.get("/logout", (req, res, next) =>
		adminUserCtrl.logout(req, res, next),
	);
};
