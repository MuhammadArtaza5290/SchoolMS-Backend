const userModel = require('../models/user-model')
const classModel = require("../models/class-model");

module.exports.viewteacher = async (req, res) => {
  const teacher = await userModel.find({ role: "teacher" });
  res.status(200).send(teacher);
}

module.exports.viewstudent = async (req, res) => {
  try {
      const student = await userModel.find({ role: "student" });
  res.status(200).send(student);
  } catch (error) {
    res.status(400).send(error)
  }

}

module.exports.deleteteacher = async (req, res) => {
  try {
     const teacher = await userModel.findOneAndDelete({
      _id: req.params.userid,
    });
    
      let deleteteachertoclass = await classModel.findOne({
        teacher: req.params.userid,
      });
    
      if(deleteteachertoclass){
        deleteteachertoclass.teacher = null;
      }
      await deleteteachertoclass.save();
    
    return res.status(200).json({success:true,message:"deleted"});
   
  } catch (error) {
    res.status(400).send(error)
  }
}

module.exports.deletestudent = async (req, res)=>{
  let student = await userModel.findOne({_id: req.params.userid})
  if(!student){
    return res.status(404).send('There is no student')
  }
  let studentDelete = await userModel.findOneAndDelete({_id: req.params.userid})

  let deleteStudenttoclass = await classModel.findOne({ classname: student.classname})
  if(deleteStudenttoclass){
  deleteStudenttoclass.student = deleteStudenttoclass.student.filter((val)=> val.toString() !== req.params.userid )
  }
  await deleteStudenttoclass.save();

  return res.status(200).json({success:true,message:"deleted"});
  
}

module.exports.teacherdata = async (req, res)=>{
    try {
        let teacher = await userModel.findOne({_id: req.params.teacherid})
        if (!teacher) {
          res.status(400).send('Something went wrong!')
        }else{
          
          return res.status(200).send(teacher)
        }
    } catch (error) {
        res.status(400).send('Something went wrong!')
    }
}

module.exports.editteacher = async (req, res)=>{
    try {
      let{name, email, phone} = req.body;
       const updateData = { name, email, phone };

    if (req.file) {
      updateData.image = req.file.path;
    }
        let updateteacher = await userModel.findOneAndUpdate({_id: req.params.teacherid}, updateData, {new: true})
        res.status(200).send(updateteacher)
    } catch (error) {
        res.status(400).send('Something went wrong!')
    }
}

module.exports.studentdata =  async (req, res)=>{
    try {
        let student = await userModel.findOne({_id: req.params.studentid})
        if (!student) {
          res.status(400).send('Something went wrong!')
        }else{
          
          return res.status(200).send(student)
        }
    } catch (error) {
        res.status(400).send('Something went wrong!')
    }
}

module.exports.editstudent = async (req, res)=>{
    try {
      let{name,fathername, email, address, phone} = req.body;
       const updateData = { name, fathername, email, address, phone };

    if (req.file) {
      updateData.image = req.file.path;
    }
        let updatestudent = await userModel.findOneAndUpdate({_id: req.params.studentid}, updateData, {new: true})
        res.status(200).send(updatestudent)
    } catch (error) {
        res.status(400).send('Something went wrong!')
    }
}
///===================== admin class controller =============================

module.exports.createclass = async (req, res)=>{
    let{ classname } = req.body;
    let findClass = await classModel.findOne({classname})
    if(findClass){
        return res.status(409).send('Class already created')
    }else{
    let Class = await classModel.create({ classname})
    res.json({
        message: 'class created',
        Class
    })
}
}

module.exports.viewclass = async (req, res)=>{
    let classes = await classModel.find().populate('teacher')
    res.send(classes)
}