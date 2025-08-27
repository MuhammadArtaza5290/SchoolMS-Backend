const mongoose = require('mongoose')
require("dotenv").config();
mongoose
.connect(process.env.MONGODB_URL)
.then(function(){
    console.log('connected');
})
.catch(function(err){
    console.log("error", err);
    
})

module.exports = mongoose.connection;