const path = require('path');
const theme = require('../../models/theme/themeModel');
var { respond } = require('../../helpers/commonHelper');
module.exports = class ThemeController {

    constructor() {
        this.themeModel = new theme();
    }

    async list(req, res, next) {
        res.locals.theme = await this.themeModel.listAll();
        next();
    }

    update(req, res) {
        this.themeModel.insertOrUpdate(req.body).then(result => {
            var response = respond(true, 'Setting updated', { ...result })
            res.json(response);
        }).catch(err => {
            var response = respond(false, 'Please input correctly', {}, err.errors);
            res.json(response);
        });
    }

}
