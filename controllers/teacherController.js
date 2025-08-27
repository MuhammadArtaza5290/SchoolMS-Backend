const classModel = require("../models/class-model");
const marksModel = require("../models/marks-model");
const attendenceModel = require('../models/attendence-model');


module.exports.teacherclass = async (req, res)=>{
    try {
        let teacherclass = await classModel.findOne({teacher: req.params.teacherid}).populate('teacher')
        if (!teacherclass) {
            return res.status(404).json({message: 'failure'})
        }
        return res.status(200).json({teacherclass})
    } catch (error) {
         return res.status(400).json({error})   
    }
}

module.exports.classstudent = async (req, res)=>{
   try {
    let students = await classModel.findOne({classname: req.params.classname}).populate('student')
    return res.status(200).json({students})
    
   } catch (error) {
    return res.status(400).json({error})
   }
    
}

//==================== marks management =============================
module.exports.classStudents = async (req, res) => {
  let classStudent = await classModel
    .findOne({ classname: req.params.classname })
    .populate("student");
  if (!classStudent) {
    return res.status(403).json({ message: "Class is not available" });
  }
  return res.status(200).json({ classStudent });
}


module.exports.marksheet =  async (req, res) => {
  try {
    let classid = await classModel.findOne({
      classname: req.body[0].classname,
    });
    let markSheet = await marksModel.create({
      classId: classid._id,
      marksheet: req.body,
    });
    if (!markSheet) {
      return res.status(404).json({ message: "Something went wrong!" });
    }
    return res.status(200).json({ markSheet });
  } catch (error) {
    res.status(400).json({ message: error });
  }
}

module.exports.allreports = async (req, res) => {
  try {
    let report = await marksModel
      .find(
        { "marksheet.studentId": req.params.studentId },
        { date: 1, "marksheet.$": 1 }
      )
      .populate("marksheet.studentId");
    res.send(report);
  } catch (error) {
    return res.status(400).send(error);
  }
}
//========================== attendence management =========================

module.exports.studentattendance =  async (req, res)=>{
    try {     
        let today = new Date()
        let dateCheck = today.toISOString().split('T')[0]
        let classes = await classModel.findOne({classname: req.body[0].classname})
        let submit = await attendenceModel.findOne({date: dateCheck, classId: classes._id})
        
        if(submit){
            return res.status(404).json({message: 'Attendence already submitted!'})
        }else{
        let attendenceForm = await attendenceModel.create({
            classId: classes._id,
            attendence: req.body,
        })
    
        if (!attendenceForm) {
            return res.status(404).json({message: 'Something went wrong'})
        }
        
        return res.status(200).json({attendenceForm})
    }
    } catch (error) {
        return res.status(400).json({error})
    }
}