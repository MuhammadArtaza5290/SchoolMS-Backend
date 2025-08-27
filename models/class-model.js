const mongoose = require('mongoose')

const classSchema = mongoose.Schema({
    classname: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }]
})

module.exports = mongoose.model('class', classSchema)