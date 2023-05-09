import { Router } from "express";
import DocumentController from "../controllers/Document.controller";

const router = Router();

// Documento em si
router.post("/create", DocumentController.createDocument);
router.post("/share", DocumentController.shareDoc);
router.get("/shared", DocumentController.getSharedDocs);
router.get("/one/:projectId", DocumentController.getCurrentProject);
router.get("/:projectId", DocumentController.getProjectDocs);
router.put("/revoke", DocumentController.removeShare);
router.put("/updateName", DocumentController.updateName);
router.put("/updateDescription", DocumentController.updateDescription);
router.delete("/delete", DocumentController.deleteDocument);

// Conteúdo
router.get("/:projectId/:documentId", DocumentController.docGetContent);
router.post("/save", DocumentController.docSaveContent);

export default router;
