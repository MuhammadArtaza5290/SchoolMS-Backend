const jwt = require('jsonwebtoken')

const generateToken = (user)=>{
   return jwt.sign({email: user.email, userId: user._id, role: user.role}, process.env.SECRATE_KEY)
}

module.exports.generateToken = generateToken