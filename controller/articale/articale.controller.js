const articaleControllerObj = {}

articaleControllerObj.getarticale = async (req,res,next) => {
    res.json({msg:'Articale found!'})
}

module.exports = articaleControllerObj