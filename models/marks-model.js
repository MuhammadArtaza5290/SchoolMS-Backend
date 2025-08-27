const mongoose = require('mongoose')

const markSchema = mongoose.Schema({
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    },
    date: {
        type: String,
        default: () => {
            const today = new Date();
            return today.toISOString().split('T')[0]; // 👈 Gives "YYYY-MM-DD"
        }
    },
    marksheet:[
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
            marks: {
                english: { type: Number, required: true },
                urdu: { type: Number, required: true },
                math: { type: Number, required: true },
                science: { type: Number, required: true }
            }
        }
    ]
})

module.exports = mongoose.model('mark', markSchema);