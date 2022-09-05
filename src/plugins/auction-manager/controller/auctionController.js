const path = require("path");
var viewPath = path.join(__dirname, "../views/");
const userSchema = require("../../user-manager/models/userSchema");
const nftSchema = require('../../nft-manager/models/nftSchema');
const likeSchema = require('../../nft-manager/models/likeSchema');
const bidSchema = require("../../../plugins/nft-manager/models/bidSchema")
const { respond,timeConverter,convertPrice } = require("../../../helpers/commonHelper");
const { getAuctionList } = require("../../../helpers/auctionHelper");
const Validator = require("validatorjs");
var lodash = require('lodash');
module.exports = class auctionController {
	async index(req, res) {
		const response = res;
		
		const auctionCallback = async (data) => {
            response.locals.js_files = [
				"/public/plugins/datatablebootstrap/jquery.dataTables.min.js",
				"/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.js",
				"https://cdn.jsdelivr.net/npm/web3js-cdn@1.3.0/web3.min.js",
				"/public/js/auction.js","/public/js/nft.js"
			];
			response.locals.css_files = [
				"/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.css",
			];
			let result = [];
			for (let index = 0; index < data.length; index++) {
				const item = data[index];
				let userData = await userSchema.findOne({address:item.auctionInfo['highestBidder']})
				result.push({
					token:item.tokenId,
					price :item.auctionInfo['price'],
					startTime :item.auctionInfo['startTime'],
					endTime :item.auctionInfo['endTime'],
					highestBid : item.auctionInfo['highestBid'],
					totalBids : item.auctionInfo['totalBids'],	
					highestBidder : item.auctionInfo['highestBidder'],
					userData:userData
				})
				
			}

			
			response.render(viewPath + "/auction_manager/index", {
				misc: {
					route_name: "auction-manager",
					title: "Auction Manager",
				},
				data: result || [],
				timeConverter,
                convertPrice
			});
		};
		getAuctionList(auctionCallback);
	}

	add(req, res, next) {
		res.locals.js_files = [
			"https://cdn.ckeditor.com/4.13.1/standard/ckeditor.js",
			"/public/plugins/input-tags/js/input-tags.js","https://cdn.jsdelivr.net/npm/web3js-cdn@1.3.0/web3.min.js","/public/js/auction.js","/public/js/nft.js"
		];
		res.locals.css_files = ["/public/plugins/input-tags/css/input-tags.css"];
		res.render(viewPath + "/auction_manager/add", {
			misc: { route_name: "auction-manager", title: "Add Auction" },
		});
	}

	view = async (req, res) => {
        let nftList = await nftSchema.find({ NftId: req.params.id })
        let like =  await likeSchema.count({likedToNft:nftList[0].NftId.toString()})
        
        let nftData = [];
        if(nftList.length > 0){
            let id = nftList[0]._id;
            let ipfs = nftList[0].ipfs ? JSON.parse(nftList[0].ipfs) : '';
            nftData.push({
                id,ipfs
            })
        }
            
        
        res.render(viewPath + '/auction_manager/view', { misc: { route_name: 'auction-manager', title: 'View NFT Detail' }, nftData,like });
    }

	histroy = async (req,res) => {
		let tokenId = req.params.id;
		let address = req.params.address;
		let bid = await bidSchema.find({nftId:Number(tokenId)});
		
		res.locals.js_files = [
			"/public/plugins/datatablebootstrap/jquery.dataTables.min.js",
			"/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.js",
		];
		res.locals.css_files = [
			"/public/plugins/datatablebootstrap/dataTables.bootstrap4.min.css",
		];
		res.render(viewPath + "/auction_manager/history", {
			misc: {
				route_name: "auction-manager",
				title: "NFT History",
			},
			data: bid || [],
			timeConverter,
                convertPrice
		});

	}

	update(req, res) {
		let validation = new Validator(req.body, {
			nft_id: "required",
			start_date: "required",
			end_date: "required",
			price: "required",
		});

		if (validation.passes()) {
			var response = respond(true, "Added Successfully", {});
			res.json(response);
		} else {
			var response = respond(
				false,
				"Please input correctly",
				{},
				validation.errors,
			);
			res.json(response);
		}
	}
};
