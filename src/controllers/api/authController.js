const jwt = require('jsonwebtoken');
const CONF = require('../../../config');
const user = require('../../models/users/usersSchema');
const userModel = require('../../models/users/usersModel');

module.exports = {
    login: (req, res, next) => {
        var username = req.body.username;
        var password = req.body.password;
        user.findOne({ username: username, password: password }).then(data => {
            if (data) {
                var authPayload = {
                    _id: data._id,
                    username: data.username,
                    name: data.name
                }
                var token = jwt.sign({
                    ...authPayload
                }, CONF.JWT_SECRET, CONF.JWT_OPTIONS);
                res.json({
                    status: true,
                    message: 'You are logged in successfully',
                    data: { token }
                })
            } else {
                res.status(401).json({
                    status: false,
                    message: 'Invalid credentials',
                })
            }
        }).catch(err => { next(err) });
    },
    register: (req, res, next) => {
        userModel.registerNewUser(req.body).then(response => {
            res.json({
                status: true,
                message: 'User has been registered successfully',
                data: { response }
            })
        }).catch(err => next(err));
        // var newUserEntity = new user(req.body);
        // newUserEntity.save().then(response => {
        //     res.json({
        //         status: true,
        //         message: 'User has been registered successfully',
        //         data: { response }
        //     })
        // }).catch(err => { next(err) });
    },
    myProfile: (req, res, next) => {
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

    },
    verifyToken: (req, res, next) => {
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
getToken = (req) => {
    const authorizationHeaader = req.headers.authorization;
    if (authorizationHeaader) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}