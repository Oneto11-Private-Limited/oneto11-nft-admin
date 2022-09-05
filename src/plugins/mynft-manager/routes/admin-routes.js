const mynftManagerCtrl = new (require('../controller/mynftController'));
module.exports = (parentRoutes) => {
    parentRoutes.get('/mynft-manager', (req, res, next) => mynftManagerCtrl.index(req, res, next));
    parentRoutes.get('/mynft-manager/view/:id', (req, res, next) => mynftManagerCtrl.view(req, res, next));
    
}