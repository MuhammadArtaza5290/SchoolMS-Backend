const userModel = require('../models/user-model')


module.exports.addProfilePic = async (req, res)=>{
  let user = await userModel.findOneAndUpdate({email: req.user.email}, {image: req.file.path})
  res.send(user)
}