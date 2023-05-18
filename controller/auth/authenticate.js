const authenticate = async (req, res, next) => {
    let userName = res.locals.userName;
    let userId = res.locals.userId;
    if(userName && userId){
        res.status(200).json({status:'success', message: 'Authorized', userName: userName });
        next();
    }else{
        res.json({status:'failed', message: 'Unauthorized', userName: 'Guest'});
        next();
    }
};

module.exports = authenticate;