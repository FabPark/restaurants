const mongoose = require('mongoose')

const restaurantsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    operationHours:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    typeOfPayment:{
        type:String,
        required:false
    },
    convenience:{
        type:String,
        required:false
    },
    website:{
        type:String,
        required:false
    },
    reviews:{
        type:String,
        required:false
    }
})

module.exports = mongoose.model('Restaurant', restaurantsSchema)