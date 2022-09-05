const nftManagerCtrl = new (require('../controller/nftController'));
module.exports = (parentRoutes) => {
    parentRoutes.get('/nft-manager', (req, res, next) => nftManagerCtrl.index(req, res, next));
    parentRoutes.get('/nft-manager/add', (req, res, next) => nftManagerCtrl.add(req, res, next));
    parentRoutes.post('/nft-manager/update', (req, res, next) => nftManagerCtrl.update(req, res, next));
    parentRoutes.get('/nft-manager/view/:id', (req, res, next) => nftManagerCtrl.view(req, res, next));
    
}