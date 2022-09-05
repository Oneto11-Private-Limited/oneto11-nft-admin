const path = require('path');
var viewPath = path.join(__dirname, '../views/');
const { respond,timeConverter,convertPrice } = require("../../../helpers/commonHelper");
const { getDealList } = require("../../../helpers/auctionHelper");

const Validator = require('validatorjs');
module.exports = class dealController {

    async index(req, res) {
		const response = res;
		const dealCallback = (data) => {
            res.locals.js_files = [
                "/public/plugins/datatablebootstrap/jquery.dataTables.min.js","/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.js",
                "https://cdn.jsdelivr.net/npm/web3js-cdn@1.3.0/web3.min.js",
				"/public/js/auction.js","/public/js/nft.js"
                
            ];
			res.locals.css_files = ["/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.css"];
			response.render(viewPath + "/deal_manager/index", {
				misc: {
					route_name: "deal-manager",
					title: "Deal Manager",
				},
				data: data || [],
                timeConverter,
                convertPrice
			});
		};
		getDealList(dealCallback);
	}

    
   

    add(req, res, next) {
        res.locals.js_files = [
			"https://cdn.ckeditor.com/4.13.1/standard/ckeditor.js",
			"/public/plugins/input-tags/js/input-tags.js","https://cdn.jsdelivr.net/npm/web3js-cdn@1.3.0/web3.min.js","/public/js/auction.js","/public/js/nft.js"
		];
        res.locals.css_files = ['/public/plugins/input-tags/css/input-tags.css'];
        res.render(viewPath + '/deal_manager/add', { misc: { route_name: 'deal-manager', title: 'Add Deal' } });
    }
    
   
    update(req, res) {
        let validation = new Validator(req.body, {
            nft_id: 'required',
            start_date: 'required',
            end_date: 'required',
            price: 'required'
        });

        if (validation.passes()) {
            var response = respond(true, 'Added Successfully', {})
            res.json(response);
        } else {
            var response = respond(false, 'Please input correctly', {}, validation.errors);
            res.json(response);
            
        }

    }
   
}
