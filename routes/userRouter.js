const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const {checkRole} = require('../middlewares/roleBaseAccess')
const {
  loginUser,
  logoutUser,
  registerTeacher,
  loginStudent
} = require("../controllers/authController");
const { addProfilePic } = require("../controllers/profileController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const uploads = require("../config/multer-config");

const { viewteacher,viewstudent, deleteteacher, deletestudent, teacherdata, editteacher, studentdata, editstudent } = require("../controllers/adminController");

// ================= This route is only for admin ======================
if (process.env.NODE_ENV === "development") {
  router.post("/user", async (req, res) => {
    try {
      let admin = await userModel.findOne({ role: "admin" });
      if (admin) {
        return res
          .status(401)
          .send("Admin already registered! please login in your account.");
      } else {
        let { name, email, role, password } = req.body;
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
              name,
              email,
              role,
              password: hash,
            });
            res.status(200).send(user);
          });
        });
      }
    } catch (error) {
      res.status(400).send(error)
    }
  });
}
//<=================== Register teacher by admin ===================>

router.post(
  "/createteacher",
  isLoggedIn,
  checkRole(['admin']),
  uploads.single("image"),
  registerTeacher
);

//>================== Register Student by admin ====================>
router.post('/createstudent', isLoggedIn, checkRole(['admin']) ,uploads.single('image') , loginStudent)

//<=================== Admin Profile route==========================>
router.get("/adminprofile", isLoggedIn, checkRole(['admin']) , (req, res) => {
  let user = req.user;
  res.send(user);
});
router.get("/teacherprofile", isLoggedIn, checkRole(['teacher']) , (req, res) => {
  let user = req.user;
  res.send(user);
});
router.get("/studentprofile", isLoggedIn, checkRole([ 'student']) , (req, res) => {
  let user = req.user;
  res.send(user);
});

// <================== Login route for all users =====================>
router.post("/login", loginUser);

// <================== Logout route ==================================>
router.get("/logout", logoutUser);

// ===================== update image ========================
router.post(
  "/editProfileData",
  isLoggedIn,
  checkRole(['admin']),
  uploads.single("image"),
  addProfilePic
);

// ==================== view teachers ========================

router.get("/viewteacher", isLoggedIn, checkRole(['admin']) , viewteacher);
// ==================== view Students ========================

router.get("/viewstudent", isLoggedIn,checkRole(['admin']), viewstudent);
//===================== delete teacher =======================

router.delete("/deleteteacher/:userid", isLoggedIn,checkRole(['admin']), deleteteacher);

//====================delete student =========================
router.delete('/deletestudent/:userid', isLoggedIn, checkRole(['admin']), deletestudent)

//====================== Edit Teacher ==========================
router.get('/teacherdata/:teacherid',isLoggedIn, checkRole(['admin']), teacherdata)

router.post('/editteacher/:teacherid', isLoggedIn, checkRole(['admin']), uploads.single('image') , editteacher)

//====================== Edit Studnet ==========================
router.get('/studentdata/:studentid',isLoggedIn, checkRole(['admin']), studentdata)


router.post('/editstudent/:studentid', isLoggedIn, checkRole(['admin']), uploads.single('image') , editstudent)

// ======================== single student data ===============================

router.get('/singlestudent/:studentid', isLoggedIn, checkRole(['student']), async (req, res)=>{
  try {
    let student = await userModel.findOne({_id: req.params.studentid})
    
    if (student) {
      return res.status(200).json({student})
    }else {
      return res.status(404).json({ error: "Student not found" });
    }
  } catch (error) {
    return res.send(error)
  }
})

module.exports = router;
