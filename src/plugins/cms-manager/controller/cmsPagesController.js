const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
var viewPath = path.join(__dirname, '../views/');
const { respond } = require('../../../helpers/commonHelper');
const cmsPages = require('../models/cmsPagesModel');
module.exports = class CmsPagesController {

    constructor() {
        this.cmsPagesModel = new cmsPages();
    }

    index(req, res) {
       
        res.render(viewPath + '/cms_manager/index', { misc: { route_name: 'cms-manager', title: 'CMS Manager' } });
    }

    async listAndSearch(req, res) {
        var list = await this.cmsPagesModel.listAll(req.query);
        if (list.result) {
            var response = respond(true, 'success', { total_record: list.count, result: list.result })
        } else {
            var response = respond(false, 'result not found')
        }
        res.json(response);
    }

   
    async edit(req, res, next) {
        res.locals.js_files = ['https://cdn.ckeditor.com/4.13.1/standard/ckeditor.js', '/public/plugins/input-tags/js/input-tags.js'];
        res.locals.css_files = ['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css','/public/plugins/input-tags/css/input-tags.css','/public/css/image-upload.css'];
        var result = await cmsPages.findOne({ _id: req.params.id });
        res.render(viewPath + '/cms_manager/edit', { misc: { route_name: 'cms-manager', title: 'Edit CMS Page' }, result });
    }
    update(req, res) {
        req.body.status = req.body.status || false;
        
        const form = new formidable.IncomingForm();
        form.parse(req);

        this.cmsPagesModel.insertOrUpdate(req.body).then(result => {
            
            var response = respond(true, 'Updated Successfully', { result })
            res.json(response);
        }).catch(err => {
            
            var response = respond(false, 'Please input correctly', {}, err.errors);
            res.json(response);
        });
        
    }
    
}
