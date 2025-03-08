import express from "express"
import handlesignup from "../controllers/user.controller.js"
const router = express.Router();

router.post("/signup", handlesignup)

export default router;