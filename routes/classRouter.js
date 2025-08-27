const express = require('express')
const router = express.Router()
const {checkRole} = require('../middlewares/roleBaseAccess')
const classModel = require('../models/class-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const { createclass, viewclass } = require('../controllers/adminController');
const { teacherclass, classstudent } = require('../controllers/teacherController');

router.post('/createclass', isLoggedIn, checkRole(['admin']) , createclass)
  

router.get('/viewclass', isLoggedIn, checkRole(['admin']) , viewclass)

router.get('/classStudent/:classid', isLoggedIn, checkRole(['admin', 'teacher']) , async (req, res)=>{
    try {
        let classfind = await classModel.findOne({ _id: req.params.classid }).populate('student');
    if(!classfind){
       return res.status(400).send('Something went wrong')
    }else{
        res.status(200).send(classfind)
    }
    } catch (error) {
        res.status(400).send('Something went wrong!')
    }
})

router.get('/teacherclass/:teacherid', isLoggedIn, checkRole(['teacher']) , teacherclass)

router.get('/classStudents/:classname', isLoggedIn, checkRole(['teacher']) , classstudent)


module.exports = router;