import providerModel from '../models/Provider.model.js';
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const providerSignup = async(req, res, next)=>{
    const {name, address, mobile_number, email, pincode, password} = req.body;
    if(!name || !address || !mobile_number || !email || !pincode || !password){
        return res.send({status:400, message:"Enter All credentials"});
    }
    try {
        const existingProvider = await providerModel.findOne({mobile_number})
        if(existingProvider){
            return res.send({status:500, message:"Provider already exists"});
        }

        const existingEmail = await providerModel.findOne({ email });
        if (existingEmail) {
            return res.send({status:400, message:"Provider with this email already exists"});
        }
        const newProvider = new providerModel({
            name,
            address,
            mobile_number: Number(mobile_number),
            email,
            pincode: Number(pincode),
            password,
        });
        await newProvider.save();
        const response = new ApiResponse(200, newProvider, "Provider registered successfully")
        res.status(response.statusCode).json(response)
    } catch (error) {
        console.log(error)
        next(new ApiError(500, 'Server Error', [error.message]))
    }
}