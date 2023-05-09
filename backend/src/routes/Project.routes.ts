import { Router } from "express";
import ProjectController from "../controllers/Project.controller";

const router = Router();

router.get("/logged", ProjectController.getUserProjects);
router.get("/:projectId", ProjectController.getProject);
router.post("/create", ProjectController.createProject);
router.put("/updateName", ProjectController.updateName);
router.put("/updateDescription", ProjectController.updateDescription);
router.delete("/delete", ProjectController.deleteProject);

export default router;
