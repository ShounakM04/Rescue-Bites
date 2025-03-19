import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected");
    }
    catch (err) {
        console.error("DB connection failed:", err.message);
        process.exit(1);
    }
};

export default dbConnection;
