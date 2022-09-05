const path = require("path");
var viewPath = path.join(__dirname, "../views/");
const { respond } = require("../../../helpers/commonHelper");
const nftSchema = require("../../nft-manager/models/nftSchema");
const likeSchema = require("../../nft-manager/models/likeSchema");
const Validator = require("validatorjs");
var _ = require("lodash");
global.window = {document: {createElementNS: () => {return {}} }};
module.exports = class nftController {
  async index(req, res) {
   
      
    if (window.ethereum) { //check if Metamask is installed
        try {
            const address = await window.ethereum.enable(); //connect Metamask
            const obj = {
                    connectedStatus: true,
                    status: "",
                    address: address
                }
                return obj;
             
        } catch (error) {
            res.render(viewPath + "/mynft_manager/index", {
                misc: { route_name: "mynft-manager", title: "My NFT Manager" },
                connectedStatus: false,
                status: "Connect to Metamask using the button on the top right."
              });
            
        }
        
  } else {
        res.render(viewPath + "/mynft_manager/index", {
            misc: { route_name: "mynft-manager", title: "My NFT Manager" },
            connectedStatus: false,
            status: "You must install Metamask into your browser: https://metamask.io/download.html"
        });
        
      } 


    }

  view = async (req, res) => {
    let nftList = await nftSchema.find({ _id: req.params.id });
    let like = await likeSchema.count({
      likedToNft: nftList[0].NftId.toString(),
    });

    let nftData = [];
    if (nftList.length > 0) {
      let id = nftList[0]._id;
      let ipfs = nftList[0].ipfs ? JSON.parse(nftList[0].ipfs) : "";
      nftData.push({
        id,
        ipfs,
      });
    }

    res.render(viewPath + "/mynft_manager/view", {
      misc: { route_name: "mynft-manager", title: "View My NFT Detail" },
      nftData,
      like,
    });
  };

  
};
