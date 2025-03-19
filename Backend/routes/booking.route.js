// routes/booking.js
import express from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { authenticateToken } from "../middlewares/auth.js";
import { getBookingsByConsumerId } from "../controllers/booking.controller.js";
const router = express.Router();

router.post("/book", authenticateToken, createBooking);
router.get("/book", authenticateToken, getBookingsByConsumerId)


export default router;