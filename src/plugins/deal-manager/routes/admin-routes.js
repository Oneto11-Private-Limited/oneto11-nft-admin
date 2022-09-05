const dealManagerCtrl = new (require('../controller/dealController'));
module.exports = (parentRoutes) => {
    parentRoutes.get('/deal-manager', (req, res, next) => dealManagerCtrl.index(req, res, next));
    parentRoutes.get('/deal-manager/add', (req, res, next) => dealManagerCtrl.add(req, res, next));
    parentRoutes.post('/deal-manager/update', (req, res, next) => dealManagerCtrl.update(req, res, next));
    
}