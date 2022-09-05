module.exports = {
    cmsPages: (req, res) => {
        // var paegData =modelfunction (req.params.slug)
        res.render('web/pages/cms', { route_name: req.params.slug, title: req.params.slug });
    }
}