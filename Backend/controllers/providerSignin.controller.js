import providerModel from '../models/Provider.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

export const providerSignin = async(req, res, next)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.send({status:400, message:"Enter All credentials"});
    }
    try {
        const existingProvider = await providerModel.findOne({email});
        if(!existingProvider){
            return next(new ApiError(400, 'Invalid Credentials'))
        }

        const isMatch = await existingProvider.comparePassword(password);
        if (!isMatch) {
            return next(new ApiError(400, 'Invalid credentials'));
        }
        const token = jwt.sign({
            ProviderId: existingProvider._id, 
            email: existingProvider.email,
            name: existingProvider.name,
            pincode: existingProvider.pincode
            },
            process.env.JWT_SECRET,
            {
            expiresIn:'1h'
            }
        )
        const response = new ApiResponse(200, { token }, 'Signin successful');
        res.status(response.statusCode).json(response);

    } catch (error) {
        next(new ApiError(500, 'Server Error', [error.message]));
    }
}