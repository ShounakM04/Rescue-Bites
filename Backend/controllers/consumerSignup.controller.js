import consumerModel from '../models/consumer.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const consumerSignup = async(req, res, next)=>{
    console.log("Request Body:", req.body);
    const {name, mobile_number, email, pincode, password} = req.body;
    if (!name || !mobile_number || !email || !pincode || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
        const existingConsumer = await consumerModel.findOne({mobile_number});
        if(existingConsumer){
            return next(new ApiError(400, 'Consumer Already Exists'))
        }

        const newConsumer = new consumerModel({ name, mobile_number, email, pincode, password });
        await newConsumer.save();

        const response = new ApiResponse(201, null, 'Consumer registered successfully')
        res.status(response.statusCode).json(response)
    }
    catch (error) {
        next(new ApiError(500, 'Server Error', [error.message]))
    }
}