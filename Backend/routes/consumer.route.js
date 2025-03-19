import { consumerSignup } from "../controllers/consumerSignup.controller.js";
import { consumerSignin } from "../controllers/consumerSignin.controller.js";
import express from "express"

const consumerRouter = express.Router();

consumerRouter.post('/signup', consumerSignup);
consumerRouter.post('/signin', consumerSignin);

export default consumerRouter;
