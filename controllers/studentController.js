const marksModel = require("../models/marks-model");
const attendenceModel = require("../models/attendence-model");

module.exports.reportdata =  async (req, res) => {
  try {
    const { studentId, marksId } = req.params;
    let report = await marksModel
      .findOne(
        { "marksheet.studentId": studentId, _id: marksId },
        { date: 1, "marksheet.$": 1 }
      )
      .populate("marksheet.studentId");

    let engPercentage = (report.marksheet[0].marks.english / 100) * 100;
    let urduPercentage = (report.marksheet[0].marks.urdu / 100) * 100;
    let mathPercentage = (report.marksheet[0].marks.math / 100) * 100;
    let sciPercentage = (report.marksheet[0].marks.science / 100) * 100;

    function getGrade(marks, total = 100) {
      let percentage = (marks / total) * 100;

      if (percentage >= 80) return "A";
      if (percentage >= 60) return "B";
      if (percentage >= 40) return "C";
      return "F";
    }

    let engGrade = getGrade(engPercentage)
    let urduGrade = getGrade(urduPercentage)
    let mathGrade = getGrade(mathPercentage)
    let sciGrade = getGrade(sciPercentage)

    let attendenceReport = await attendenceModel.find({"attendence.studentId": req.params.studentId},{"attendence.$": 1})
    let count = 0
    attendenceReport.forEach((val)=>{
        if (val.attendence[0].status === 'present') {
          count++
        }
    })
   let attendPercentage = Number(((count / attendenceReport.length) * 100).toFixed(2));
    function totalMarks(eng, urdu, math, sci){
      return eng+urdu+math+sci
    }
    let total = totalMarks(report.marksheet[0].marks.english, report.marksheet[0].marks.urdu, report.marksheet[0].marks.math, report.marksheet[0].marks.science)
    
    
    res.status(200).json({ total, attendPercentage, report , engGrade, urduGrade, mathGrade, sciGrade, engPercentage, urduPercentage, mathPercentage, sciPercentage});
  } catch (error) {
    return res.status(400).send(error);
  }
}