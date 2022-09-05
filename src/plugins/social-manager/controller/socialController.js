const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
var viewPath = path.join(__dirname, '../views/');
const { respond } = require('../../../helpers/commonHelper');
const social = require('../models/socialModel');
module.exports = class CmsPagesController {

    constructor() {
        this.social = new social();
    }

    index(req, res) {
       
        res.render(viewPath + '/social_manager/index', { misc: { route_name: 'social-manager', title: 'Social Manager' } });
    }

    async listAndSearch(req, res) {
        var list = await this.social.listAll(req.query);
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
        var result = await social.findOne({ _id: req.params.id });
        res.render(viewPath + '/social_manager/edit', { misc: { route_name: 'social-manager', title: 'Edit Social' }, result });
    }
    update(req, res) {
        req.body.status = req.body.status || false;
        
        const form = new formidable.IncomingForm();
        form.parse(req);

        this.social.insertOrUpdate(req.body).then(result => {
            let redirect = '/social-manager'
            var response = respond(true, 'Updated Successfully',{redirect})
            res.json(response);
        }).catch(err => {
            console.log(err,"dddd")
            var response = respond(false, 'Please input correctly', {}, err.errors);
            res.json(response);
        });
        
    }
    
}
