import { Router } from "express"
import getHomework from "../controllers/homeworkController.js"

const router = Router()

router.route("/:studentId/:homeworkKey").get(getHomework)

export default router
