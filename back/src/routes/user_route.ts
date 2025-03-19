import express from "express";
const router = express.Router();
import userController from "../controllers/user_controller";

router.get("/:username", userController.findUser);
router.put("/:username", userController.updateUser);


export default router;