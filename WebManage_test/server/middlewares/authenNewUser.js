const TableManifest = require("../models/middlewareDatabase/TableManifest");
module.exports = (req, res, next) => {

    req.currentUser = {
        permission_id: TableManifest.NEW_REGISTER
    };
    next();
}