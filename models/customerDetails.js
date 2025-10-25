const mongoose = require('mongoose')
const joi = require('joi')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;

const customerDetailSchema= new Schema({
    username : {
        type : String,
    },
    emailId : {
        type : String,
        required : true,
    },
    Address :{
        type : String,
    },
    phone_no : {
        type : Number,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
});

customerDetailSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("customerDetail",customerDetailSchema);