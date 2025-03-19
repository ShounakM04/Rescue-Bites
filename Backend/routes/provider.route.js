import { providerSignin } from "../controllers/providerSignin.controller.js";
import { providerSignup } from "../controllers/providerSignup.controller.js";
import express from "express"

const providerRouter = express.Router();

providerRouter.post('/signup', providerSignup);
providerRouter.post('/signin', providerSignin)

export default providerRouter;