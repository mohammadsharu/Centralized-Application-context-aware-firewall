import { Router } from "express";
import multer from "multer";
import {sendProgramList,sendSystemInfo} from './../../controllers/Agent.controller.js'

const agentRouter = Router();

const upload = multer();

agentRouter.route('/send-programs-list').post(upload.none(),sendProgramList)


export default agentRouter