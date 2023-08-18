const userModel = require('../../models/users.model')
const postModel = require('../../models/post.model')

const userControllerObj = {}

userControllerObj.userProfileOverview = async (req,res,next) =>{
    const userName = req?.params?.username;
    if(userName){
        const userDetails = await userModel.findOne({username:userName},{__v:0,_id:0,password:0,role:0,createdAt:0,email:0})
        res.json({userDetails})
    }
}

module.exports = userControllerObj