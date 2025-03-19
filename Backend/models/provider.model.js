import mongoose from "mongoose";
import bcrypt from "bcrypt";

const providerSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
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
        required:true,
        unique:true
    },
    pincode:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

providerSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

providerSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const providerModel = mongoose.model("provider", providerSchema);
export default providerModel;