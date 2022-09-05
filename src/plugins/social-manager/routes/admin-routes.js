const socialManagerCtrl = new (require('../controller/socialController'));

module.exports = (parentRoutes) => {
    parentRoutes.get('/social-manager', (req, res, next) => socialManagerCtrl.index(req, res, next));
    parentRoutes.get('/social-manager/list', (req, res, next) => socialManagerCtrl.listAndSearch(req, res, next));
    parentRoutes.get('/social-manager/edit/:id', (req, res, next) => socialManagerCtrl.edit(req, res, next));
    parentRoutes.post('/social-manager/update', (req, res, next) => socialManagerCtrl.update(req, res, next));
    
}