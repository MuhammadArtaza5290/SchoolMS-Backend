const mongoose = require('mongoose')

const attendenceSchema = mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    date: {
        type: String,
        default: () => {
            const today = new Date();
            return today.toISOString().split('T')[0]; // 👈 Gives "YYYY-MM-DD"
        }
    },
    attendence: [{
        studentId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        status: {
            type: String,
            enum:["present", "absent" , "leave"],
            required: true
        }
    }]
})

module.exports = mongoose.model('attendence', attendenceSchema)