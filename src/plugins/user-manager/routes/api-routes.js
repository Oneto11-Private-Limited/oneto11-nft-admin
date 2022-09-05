const authController = new (require('../controllers/api/authController'));
const userController = new (require('../controllers/api/userController'));
const authMdlwr = require('../../../middleware/apiMiddleware');

module.exports = (apiRoutes) => {
    apiRoutes.post('/login', (req, res, next) => authController.login(req, res, next));    
    apiRoutes.post('/register', (req, res, next) => authController.register(req, res, next));
    apiRoutes.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));
    apiRoutes.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));
    apiRoutes.post('/update-user', [authMdlwr.validateToken], (req, res, next) => userController.updateUser(req, res, next));    
}
