/**
 * url in authAllow array will not be evaluate authentication
 * add (*) in url if url has any dynamic segment
 */
var authAllow = ['/', '/login'];

exports.authorizeUser = (req, res, next) => {    
    var urlIsAllowedWithoutAuth = authAllow.find(res=>{
        if(res.indexOf('*')>-1){
            var starRemovedUrl = res.replace('/*','');
            if(req.originalUrl.indexOf(starRemovedUrl)>-1){
                return true;
            }else{
                return false;
            }
        }
    })
    if (authAllow.indexOf(req.originalUrl) > -1 || urlIsAllowedWithoutAuth) {
        next();
    } else {
        if (req.session.user) {
            res.locals.auth = req.session.user;
            next()
        } else {
            req.flash('info', 'Please login to access')
            res.redirect('/')
        }
    }
}
