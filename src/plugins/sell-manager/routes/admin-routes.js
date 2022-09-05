const sellManagerCtrl = new (require('../controller/sellController'));
module.exports = (parentRoutes) => {
    parentRoutes.get('/sell-manager', (req, res, next) => sellManagerCtrl.index(req, res, next));
    parentRoutes.get('/sell-manager/add', (req, res, next) => sellManagerCtrl.add(req, res, next));
    parentRoutes.post('/sell-manager/update', (req, res, next) => sellManagerCtrl.update(req, res, next));
    
}