const path = require('path');
var viewPath = path.join(__dirname, '../views/');
const { respond } = require('../../../helpers/commonHelper');
const nftSchema = require('../../nft-manager/models/nftSchema');
const likeSchema = require('../../nft-manager/models/likeSchema');
const Validator = require('validatorjs');
var _ = require('lodash');
module.exports = class nftController {

  

    async index(req, res) {

        let nftList = await nftSchema.find().sort({NftId:-1})
        
        let nftvalue = [];
        for (let index = 0; index < nftList.length; index++) {
            let id = nftList[index]._id;
            let nft_id = nftList[index].NftId;
            let ipfs = nftList[index].ipfs ? JSON.parse(nftList[index].ipfs) : '';
            nftvalue.push({
                id,nft_id,ipfs
            })
        }
        ;
        
        res.locals.js_files = [
            "/public/plugins/datatablebootstrap/jquery.dataTables.min.js","/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.js",
            
        ];
        res.locals.css_files = ["/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.css"];
        res.render(viewPath + '/nft_manager/index', { misc: { route_name: 'nft-manager', title: 'NFT Manager' },nftvalue});
    }

   

    add(req, res, next) {
        res.locals.js_files = ['https://cdn.ckeditor.com/4.13.1/standard/ckeditor.js', '/public/plugins/input-tags/js/input-tags.js'];
        res.locals.css_files = ['https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css','/public/css/image-upload.css'];
        res.render(viewPath + '/nft_manager/add', { misc: { route_name: 'nft-manager', title: 'Add NFT' } });
    }

    view = async (req, res) => {
        let nftList = await nftSchema.find({ _id: req.params.id })
        let like =  await likeSchema.count({likedToNft:nftList[0].NftId.toString()})
        
        let nftData = [];
        if(nftList.length > 0){
            let id = nftList[0]._id;
            let ipfs = nftList[0].ipfs ? JSON.parse(nftList[0].ipfs) : '';
            nftData.push({
                id,ipfs
            })
        }
            
        
        res.render(viewPath + '/nft_manager/view', { misc: { route_name: 'nft-manager', title: 'View NFT Detail' }, nftData,like });
    }
    
   
    update(req, res) {
        let validation = new Validator(req.body, {
            title: 'required',
            property: 'required',
            detail: 'required',
            price: 'required',
            name: 'required'

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
