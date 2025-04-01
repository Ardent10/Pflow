import { Router } from "express";
import { validate } from "../middleware/validator";
import { PolicyTemplateSchema } from "../types";
import * as templateController from "../controllers/template";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  validate(PolicyTemplateSchema),
  authMiddleware,
  templateController.createTemplate
);
router.get("/", authMiddleware, templateController.getTemplates);
router.put(
  "/:id",
  validate(PolicyTemplateSchema),
  authMiddleware,
  templateController.updateTemplate
);
router.get(
  "/pending",
  authMiddleware,
  templateController.getPendingApprovalTemplates
);
router.get("/:id", authMiddleware, templateController.getTemplateById);
router.put(
  "/approve/:id",
  authMiddleware,
  templateController.approveTemplateAndPolicies
);

export default router;
