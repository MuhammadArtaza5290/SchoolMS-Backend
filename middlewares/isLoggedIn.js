const jwt = require('jsonwebtoken')
const userModel = require('../models/user-model')

module.exports = async function(req, res, next){
    if(!req.cookies || !req.cookies.token){
        return res.status(401).json({message:'You must be loggedIn'})
    }
    try {
    let decode = jwt.verify(req.cookies.token, process.env.SECRATE_KEY)
    let user = await userModel.findOne({role: decode.role, email: decode.email})
    req.user = user
    next()
    } catch (error) {
        res.send(error)
    }

}