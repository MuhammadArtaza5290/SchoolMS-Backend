const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const {checkRole} = require('../middlewares/roleBaseAccess')
const { classStudents, marksheet, allreports } = require("../controllers/teacherController");
const { reportdata } = require("../controllers/studentController");
const router = express.Router();

router.get("/classStudent/:classname", isLoggedIn, checkRole(['teacher']), classStudents);

router.post("/marksheet", isLoggedIn, checkRole(['teacher']), marksheet);

router.get("/allreports/:studentId", isLoggedIn, checkRole(['student']), allreports);

router.get("/reportData/:studentId/:marksId", isLoggedIn,checkRole(['student']) , reportdata);


module.exports = router;
