const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dauwcbrgo/image/upload/v1756284492/images_nnbrqs.jpg'
    },
    name: { type: String, required: true },
    fathername: { type: String },
    email: { 
    type: String, 
    unique: true, 
    required: true, 
    match: [/^.+@.+\..+$/, "Please enter a valid email"] 
    },
    phone: { type: Number, required: true , unique: true},
    address: { type: String },
    password: { type: String, required: true },
    classname: { type: String, required: true },
    role:{
        type: String,
        enum:['admin', 'teacher', 'student'],
        required: true
    }

})

module.exports = mongoose.model('user', userSchema)