const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const classModel = require('../models/class-model')

const { generateToken } = require('../utils/generateToken')



module.exports.loginUser = async (req, res) => {
 try {
    let { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send("Email or Password is incorrect");
  }
  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
        let token = generateToken(user);
        res.cookie('token', token , {
           httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS me secure cookie
             sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        })
        res.status(200).json({
          message: 'Login successfully!',
          role: user.role
        });
    } else {
      res.status(401).send("Email or Password is incorrect");
    }
  });

 } catch (error) {
    res.send(error)
 }
}



module.exports.logoutUser = (req, res)=>{
    res.cookie('token', "");
    res.send('Logout successfully')
}


module.exports.registerTeacher = async (req, res) => {
  try {
    let teacherUser = await userModel.find({ role: "teacher" });
    // 1. check total number of teachers.
    if (teacherUser.length >= 10) {
      return res.status(409).send("Seats are not available!");
    } else {
      let { name, email, classname, role, phone, password } = req.body;
      let userByClass = await userModel.findOne({classname, role: 'teacher'});
      let clssses = await classModel.findOne({classname})
      if(!clssses){
        return res.status(400).json({message: "Please create the class before create teacher!"})
      }
      
      let userEmail = await userModel.findOne({ email });
      // 2. check if email already exsist
      if (userEmail) {
        return res.status(409).send("You already registered. Please Login!");
      } else {
        //3. Check if class already assigned to another teacher
        if(userByClass){
          return res.status(409).send('Class already assigned')
        }else{
          // 4. Now create teacher
          let salt = await bcrypt.genSalt(10)
          let hash = await bcrypt.hash(password, salt)
            let teacher = await userModel.create({
              image: req.file.path,
              name,
              email,
              classname,
              role,
              phone,
              password: hash,
            });
            //5. find class and push teacher id in class document.
            let classfind = await classModel.findOne({classname})
            classfind.teacher = teacher._id;
            await classfind.save()
            res.status(200).send(teacher);
        }
      }
    }
  } catch (error) {
   res.status(400).send(error)
  }
};

module.exports.loginStudent = async (req, res)=>{
  let{ name, fathername, email, role, classname, address, phone, password } = req.body;
  try {
       let userEmail = await userModel.findOne({ email });
        let clssses = await classModel.findOne({classname})
        if(!clssses){
          return res.status(400).json({message: "Please create the class before create teacher!"})
        }
        // 2. check if email already exsist
        if (userEmail) {
          return res.status(409).send("Student already registered. Please Login!");
        } else {
          let salt = await bcrypt.genSalt(10);
          let hash = await bcrypt.hash(password, salt)
          let user = await userModel.create({
            image: req.file.path,
            name,
            fathername,
            email,
            role,
            classname,
            address,
            phone,
            password: hash
          })
          let classfind = await classModel.findOne({classname})
          
          if (!classfind) {
            return res.status(404).send("Class not found!");
          }
          classfind.student.push(user._id)
          await classfind.save();
          res.status(200).json({message:'success', user})
        }
  } catch (error) {
   res.status(400).send(error)
    
  }

}