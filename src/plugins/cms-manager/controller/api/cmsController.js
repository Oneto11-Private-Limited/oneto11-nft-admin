const cmsPages = require('../../models/cmsPagesModel');
const cmsSchema = require('../../models/cmsPagesSchema');



module.exports = class cmsController {
    constructor() {
        this.cmsPagesModel = new cmsPages();
    }

    fetchMenu = (req, res, next) => {
        cmsPages
      .find({status:true},{slug:1,order:1,name:1,last_name:1})
      .then(data => {
        if (data) {
            res.status(200).json({
                status: true,
                response: data
            })
        } else {
            res.status(401).json({
                status: false,
                response: [],
            })
        }
      })
      .catch(err => 
        next(err));
    }
    fetchhome = (req, res, next) => {
        cmsPages
      .find({status:true},{slug:1,order:1,feature_image:1,name:1,short_heading:1,last_name:1})
      .then(data => {
        if (data) {
            res.status(200).json({
                status: true,
                response: data
            })
        } else {
            res.status(401).json({
                status: false,
                response: [],
            })
        }
      })
      .catch(err => 
        next(err));
    }
    getBySlug = (req,res,next) =>{
        if(req.body.slug){
            cmsPages
            .find({status:true,slug:req.body.slug},{name:1,last_name:1,meta_title:1,meta_keywords:1,meta_description:1,content:1,status:1,slug:1,feature_image:1,short_description:1,short_heading:1})
            .then(data => {
              if (data) {
                  res.status(200).json({
                      status: true,
                      response: data
                  })
              } else {
                  res.status(401).json({
                      status: false,
                      response: [],
                  })
              }
            })
            .catch(err => 
              next(err));
        }
    }
    fetchBySlug = (req,res,next) =>{
        if(req.params.slug){
            return new Promise((resolve, reject) => {
                cmsSchema.aggregate([
                    {

                        $match:{
                            slug:req.params.slug,
                            status:true
                        }
                    },
                    
                    {
                        $project: {
                            name:1,
                            meta_title:1,
                            last_name:1,
                            meta_keywords:1,
                            meta_description:1,
                            content:1,status:1,
                            slug:1,
                            feature_image:1,
                            short_description:1,
                            short_heading:1
                            
                        }
                    },
    
                    {
                        $lookup: {
                            from: "features",
                            localField: "_id",
                            foreignField: "page_id",
                            as: "features"
                        }
                    },
    
                    {
                        $project: {
                            name:1,
                            meta_title:1,
                            last_name:1,
                            meta_keywords:1,
                            meta_description:1,
                            content:1,
                            status:1,
                            slug:1,
                            feature_image:1,
                            short_description:1,
                            short_heading:1,
                            features: 1,
                            
    
                        }
                    },
                ]).then(result => {
                    if(result){
                        res.status(200).json({
                            status: true,
                            response: result
                        })
                    }else{
                        res.status(401).json({
                            status: false,
                            response: [],
                        })
                    }
                   
                   
                }).catch(e => reject(e));
            })
        }
    }


}