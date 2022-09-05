
const cmsController = new (require('../controller/api/cmsController'));
const authMdlwr = require('../../../middleware/apiMiddleware');



module.exports = (apiRoutes) => {
    apiRoutes.get('/fetch-menu',(req, res, next) => cmsController.fetchMenu(req, res, next));
    apiRoutes.get('/home-page',(req, res, next) => cmsController.fetchhome(req, res, next));
    apiRoutes.get('/slug/:slug',(req, res, next) => cmsController.fetchBySlug(req, res, next));
    apiRoutes.post('/fetch-menu',(req, res, next) => cmsController.fetchMenu(req, res, next));
    apiRoutes.post('/home-page',(req, res, next) => cmsController.fetchhome(req, res, next));
    apiRoutes.post('/slug',(req, res, next) => cmsController.getBySlug(req, res, next)); 
        
}
