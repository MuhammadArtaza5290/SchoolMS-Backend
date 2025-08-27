const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const {checkRole} = require('../middlewares/roleBaseAccess')
const router = express.Router()
const { studentattendance } = require('../controllers/teacherController');


router.post('/studentattendence', isLoggedIn,checkRole(['teacher']), studentattendance)

module.exports = router;