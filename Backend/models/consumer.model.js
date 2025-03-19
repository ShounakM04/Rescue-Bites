import mongoose from "mongoose";
import bcrypt from "bcrypt"

const consumerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobile_number:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    password:{
        type: String,
        required: true,
    }
})

consumerSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

consumerSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const consumerModel = mongoose.model("Consumer", consumerSchema);
export default consumerModel;