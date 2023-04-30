import { Router } from "express";
import ProductController from "../controllers/Project.controller";

const router = Router();

router.get("/logged", ProductController.getUserProjects);
router.post("/create", ProductController.createProject);
router.put("/updateName", ProductController.updateName);
router.put("/updateDescription", ProductController.updateDescription);
router.delete("/delete", ProductController.deleteProject);

export default router;
