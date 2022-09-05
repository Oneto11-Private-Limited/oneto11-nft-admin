const cmsManagerCtrl = new (require('../controller/cmsPagesController'));

module.exports = (parentRoutes) => {
    parentRoutes.get('/cms-manager', (req, res, next) => cmsManagerCtrl.index(req, res, next));
    parentRoutes.get('/cms-manager/list', (req, res, next) => cmsManagerCtrl.listAndSearch(req, res, next));
    parentRoutes.get('/cms-manager/edit/:id', (req, res, next) => cmsManagerCtrl.edit(req, res, next));
    parentRoutes.post('/cms-manager/update', (req, res, next) => cmsManagerCtrl.update(req, res, next));
    
}