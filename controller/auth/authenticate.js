const userModel = require('../../models/users.model');

const authenticate = async (req, res, next) => {
  let userId = req.session.userId;
  let userName = req.session.userName;
  if (userId && userName) {
    let sessionId = req.session.id;
    let userData = await userModel.findById(userId);
    let userProfilePic = userData.profilePic;
    req.sessionStore.destroy(sessionId, (err) => {
      let errorMessage = 'Session error!';
      if (err) {
        let error = new Error(errorMessage);
        error.status = 500;
        return next(error);
      }
      req.session.regenerate((err) => {
        if (err) {
          let error = new Error(errorMessage);
          error.status = 500;
          return next(error);
        }
        req.session.userId = userId;
        req.session.userName = userName;
        req.session.save((err) => {
          if (err) {
            let error = new Error(errorMessage);
            error.status = 500;
            return next(error);
          }
          res.status(201).json({ status: 'success', message: 'Authenticated', userName: userName, profile_pic: userProfilePic });
          next();
        });
      });
    });
  } else {
    res.json({ status: 'failed', message: 'Unauthenticated', userName: 'Guest', profile_pic: 'user.png' });
    next();
  }
};

module.exports = authenticate;