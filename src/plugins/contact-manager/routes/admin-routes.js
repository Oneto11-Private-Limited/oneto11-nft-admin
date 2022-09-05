const contactCtrl = new (require("../controllers/admin/contactController"))();


module.exports = (parentRoutes) => {
	parentRoutes.get("/contact-manager", (req, res, next) =>
	contactCtrl.index(req, res, next),
	);
	parentRoutes.get("/contact-manager/list", (req, res, next) =>
	contactCtrl.listAndSearch(req, res, next),
	);
	
	parentRoutes.get("/contact-manager/view/:id", (req, res, next) =>
	contactCtrl.view(req, res, next),
	);
	parentRoutes.get("/contact-manager/delete/:id", (req, res, next) =>
	contactCtrl.delete(req, res, next),
	);
};
