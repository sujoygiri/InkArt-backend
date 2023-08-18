const logout = (req, res, next) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                let error = new Error();
                error.message = "Something went wrong in our side! Don't worry try again after some time.";
                error.status = 500;
                return next(error);
            }
            res.json({ success: 1, msg: 'Log out successfull!' });
            next();
        });
        // let sessionId = req.sessionID;
        // req.sessionStore.destroy(sessionId, (err) => {
        //     console.log('Error happend!');
        //     let errorMessage = 'Session error!';
        //     if (err) {
        //         let error = new Error(errorMessage);
        //         error.status = 500;
        //         return next(error);
        //     }
        //     res.json({ success: 1, msg: 'Log out successfull!' });
        //     next();
        // });
    } else {
        res.json({ success: 0, msg: "No session found!" });
        next();
    }
};



module.exports = logout;