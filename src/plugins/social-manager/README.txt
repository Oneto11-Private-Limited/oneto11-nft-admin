Include below line in main route file like in admin or front to register plugin

commonHelper.loadPlugin('cms-manager', adminRouter);


Include below line in sidebar.ejs present in the src/views/admin/partials/sidebar.ejs

<%- include('../../../plugins/cms-manager/views/menu');%>

