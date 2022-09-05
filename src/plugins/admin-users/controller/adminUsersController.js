const path = require('path');
const adminUser = require('../models/admin_users/adminUsersModel')
const userSchema = require('../../user-manager/models/userSchema');
const reportSchema = require('../../report-manager/models/reportSchema');
var viewPath = path.join(__dirname, '../views/');
const { respond } = require('../../../helpers/commonHelper');
const { totalAuctionfunction,totalSellfunction,totalDealfunction } = require('../../../helpers/auctionHelper');
const { totalSupply } = require('../../../helpers/nftHelper');



const mongoose = require('mongoose');
const Validator = require('validatorjs');

module.exports = class adminUsersController {
    constructor() {
        this.adminUser = new adminUser();
    }

    index = (req, res, next) => {
        if (req.session.user) {
            return res.redirect('/dashboard')
        }
        res.render(viewPath + '/admin_users/login', { layout: 'admin/layouts/login', misc: { route_name: 'login', title: 'Login' } });
    }

    login = (req, res, next) => {
        var username = req.body.username;
        var password = req.body.password;

        adminUser.findOne({ username: username }, ['password', 'name', 'username', 'profile_picture', 'timezone']).then(data => {
            if (data) {
                if (new adminUser().validatePassword(password, data.password)) {
                    delete data['password'];
                    req.session.user = data;
                    req.flash('success', 'You have logged in successfully')
                    return res.redirect('/dashboard');
                } else {
                    req.flash('error', 'Invalid Password buddy')
                    return res.redirect('/');
                }
            } else {
                req.flash('error', 'Invalid request')
                return res.redirect('/');
            }
        }).catch(err => next(err));
    }

    dashboard = async (req, res) => {
        const userCount = await userSchema.count();
        const reportCount = await reportSchema.count({ deleted: { $eq: null } });
        const auction = await totalAuctionfunction();
        const sell = await totalSellfunction();
        const deal = await totalDealfunction();
        const totalNft = await totalSupply();
        res.render(viewPath + '/admin_users/dashboard', { misc: { route_name: 'dashboard', title: 'Dashboard' },userCount,reportCount,auction,sell,deal,totalNft });
    }

    myAccount = (req, res) => {
        res.locals.css_files = ['/public/css/image-upload.css'];
        var timezoneArray = require('../../../seeds/timezoneSeeds');
        adminUser.findOne({ _id: new mongoose.Types.ObjectId(req.session.user._id) }, ['name', 'username', 'email', 'profile_picture', 'timezone']).then(user => {
            if (user) {
                res.render(viewPath + '/admin_users/profile', { misc: { route_name: 'profile', title: 'My Account' }, user: user, timezoneArray });
            } else {
                res.render(viewPath + '/admin_users/profile', { misc: { route_name: 'profile', title: 'My Account' }, user: null, timezoneArray });
            }
        });
    }

    updateProfile = (req, res) => {
        this.adminUser.update(req.body, req.file).then(result => {
            delete result['password'];
            delete result['deleted_at'];
            delete result['created_at'];
            delete result['updated_at'];
            req.session.user = result;
            var response = respond(true, 'Profile updated successfully', { result })
            res.json(response);
        }).catch(err => {
            var response = respond(false, 'Please input correctly', {}, err.errors);
            res.json(response);
        });
    }

    changePassword = (req, res) => {
        //validate current password
        adminUser.findOne({ _id: req.body._id }, ['password']).then(data => {
            if (data) {
                if (new adminUser().validatePassword(req.body.current_password, data.password)) {
                    this.adminUser.updatePassword(req.body).then(result => {
                        var response = respond(true, 'Password updated successfully')
                        res.json(response);
                    }).catch(err => {
                        var response = respond(false, 'Invalid Request', {}, err.errors);
                        res.json(response);
                    });
                } else {
                    var response = respond(false, 'Invalid Password', {}, []);
                    res.json(response);
                }
            } else {
                var response = respond(false, 'Invalid Request', {}, []);
                res.json(response);
            }
        }).catch(err => {
            var response = respond(false, 'Invalid Request', {}, err.errors);
            res.json(response);
        });
    }

    logout = (req, res) => {
        req.session.destroy((err) => {
            if (err)
                next(err)
            return res.redirect('/admin');
        })
    }

    registerAdminUser = (req, res, next) => {
        var adminModel = new adminUser();
        adminModel.registerNewUser(req.body).then(data => {
            console.log(data);
            res.redirect('/');
        }).catch(err => next(err))
    }
}
