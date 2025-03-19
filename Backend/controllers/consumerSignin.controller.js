import consumerModel from '../models/consumer.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import generateToken from '../utils/generateToken.js'
dotenv.config();

export const consumerSignin = async(req, res, next)=>{
    const {mobile_number, password} = req.body;
    if(!mobile_number || !password){
        return res.status(400).json({ status: 400, message: "Enter all credentials" });
    }
    try {
        const existingConsumer = await consumerModel.findOne({mobile_number});
        if(!existingConsumer){
            return res.status(400).json({ status: 400, message: "Invalid Credentials" });
        }

        const isMatch = await existingConsumer.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ status: 400, message: "Invalid Credentials" });
        }
        const token = jwt.sign({
            consumerId:existingConsumer._id, 
            email:existingConsumer.email,
            pincode:existingConsumer.pincode
            },
            process.env.JWT_SECRET,
            {
            expiresIn:'1h'
            }
        )
        const response = new ApiResponse(200, { token }, 'Signin successful');
        // console.log(response)
        res.status(response.statusCode).json(response);

    } catch (error) {
        return res.status(400).json({ status: 400, message: "Invalid Credentials" });
    }
}