const jwt = require('jsonwebtoken');
const CONF = require('../../config');

exports.validateToken = (req,res,next) => {
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
        next(new Error('Invalid token'));
    }
}

getToken = (req) => {
    const authorizationHeaader = req.headers.authorization;
    if (authorizationHeaader) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}