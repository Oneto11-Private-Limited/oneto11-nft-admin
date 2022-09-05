const auctionManagerCtrl = new (require('../controller/auctionController'));
module.exports = (parentRoutes) => {
    parentRoutes.get('/auction-manager', (req, res, next) => auctionManagerCtrl.index(req, res, next));
    parentRoutes.get('/auction-manager/add', (req, res, next) => auctionManagerCtrl.add(req, res, next));
    parentRoutes.post('/auction-manager/update', (req, res, next) => auctionManagerCtrl.update(req, res, next));
    parentRoutes.get('/auction-manager/view/:id', (req, res, next) => auctionManagerCtrl.view(req, res, next));
    parentRoutes.get('/auction-manager/histroy/:id/:address', (req, res, next) => auctionManagerCtrl.histroy(req, res, next));
    
    
}