const userModel = require('../../models/users.model')

const verifysession = async (req, res, next) => {
    if (req.body) {
        req.body = {};
    }
    let userId = req.session.userId;
    if (userId) {
        let userDetails = await userModel.findById(userId);
        let userName = userDetails.name;
        res.locals.userId = userId;
        res.locals.userName = userName;
    }
    next();
};

module.exports = verifysession;