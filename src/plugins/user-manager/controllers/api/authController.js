const jwt = require('jsonwebtoken');
const CONF = require('../../../../../config');
const userSchema = require('../../models/userSchema');
const userModel = require('../../models/userModel');
const Validator = require('validatorjs');
const {generateRandomString } = require('../../../../helpers/commonHelper');
const {sendMail,getEmailTemplate} = require('../../../../helpers/emailHelper');

module.exports = class authController {
    
    constructor() {
        this.userModel = new userModel();
    }

    login = (req, res, next) => {
        var email = req.body.email;
        var password = req.body.password;
        userSchema.findOne({ email: email }).then(data => {             
            if (data && this.userModel.validatePassword(password, data.password)) {
                var authPayload = {
                    _id: data._id,
                    username: data.username,
                    name: data.name,
                    profile_picture: data.profile_picture ? data.profile_picture : '',
                    email:data.email,
                    gender:data.gender
                }
                var token = jwt.sign(authPayload, CONF.JWT_SECRET, CONF.JWT_OPTIONS);

                res.json({
                    status: true,
                    message: 'You are logged in successfully',
                    response: { ...authPayload, token }
                })
            } else {               
                res.status(401).json({
                    status: false,
                    message: 'Invalid Email or password',
                })
            }
        }).catch(err => { next(err) });
    }

    register = async (req, res, next) => {
        const user = await userSchema.findOne({email:req.body.email});        
        if(user) {
            res.status(401).json({
                status: false,
                message: 'Email already exists'
            })
            return;
        }
        this.userModel.registerNewUser(req.body).then(response => {
            res.json({
                status: true,
                message: 'User has been registered successfully'
            })
        }).catch(err => {
            res.status(401).json({
                status: false,
                message: err.message,
                errors: (err.errors) ? err.errors : ''
            })
        });
    }
    myProfile = (req, res, next) => {
        user.findOne({ _id: req.auth._id }).then(response => {
            if (response) {
                res.json({
                    status: true,
                    message: 'Profile has been successfully fetched',
                    data: { user: response }
                })
            } else {
                res.json({
                    status: false,
                    message: 'Unable to fetch profile',
                })
            }
        }).catch(err => next(err))
    }

    forgotPassword = (req,res,next) => {
        let validation = new Validator(req.body, {
            email: 'required|email'
        });
        if (validation.fails()) {            
            res.status(401).json({
                status: false,
                message: 'The email field must be valid',
            });
            return;
        }
        const token = generateRandomString();
        userSchema.findOneAndUpdate({ email: req.body.email }, { $set: { reset_password_token: token } }).then(async (user) => {
            if (user) {
                var content = '';
                const template = await getEmailTemplate('Forgot Password');
                content += template.content.replace(/##reset_password_url##/gi, FRONTEND_URL + '/reset-password/' + token);
                sendMail(user.email, template.subject, content, template.type);
            }
            res.json({
                status: true,
                message: 'You will received an email with instructions to reset your password'            
            })
        }).catch(err => {
            res.status(500).json({
                status: false,
                message: err.message,
            });
        });
    }

    resetPassword = async (req,res,next) => {
        const user = await userSchema.findOne({'reset_password_token':req.body.token});
        if(!user) {
            res.status(500).json({
                status: false,
                message: 'Invalid Token',
            });
            return;
        }
        const requestData = {
            _id : user._id,
            password: req.body.password
        }
        this.userModel.updatePassword(requestData).then(result => {
            res.status(200).json({
                status: true,
                message: 'Password changed successfully!',
            })
        }).catch(err => {
            res.status(500).json({
                status: false,
                message: err.message,
            })
        });
    }

    verifyToken = (req, res, next) => {
        const token = getToken(req);
        if (token) {
            try {
                var user = jwt.verify(token, CONF.JWT_SECRET, CONF.JWT_OPTIONS);
                req.auth = user;
                next();
            } catch (err) {
                res.status(401);
                next(err);
            }
        } else {
            res.status(401);
            next(new Error('Please provide token'));
        }
    }
}

