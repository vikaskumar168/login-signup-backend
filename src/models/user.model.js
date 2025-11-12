const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobileNumber:{
        type:String,
        required:true,
    },
    userType:{
        type:String,
        enum:['applicant','recruiter'],
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);