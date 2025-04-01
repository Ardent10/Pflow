import { Router } from "express";
import { validate } from "../middleware/validator";
import { PolicySchema, PolicyApprovalSchema } from "../types";
import * as policyController from "../controllers/policy";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(PolicySchema),
  policyController.createPolicy
);
router.get("/", authMiddleware, policyController.getPolicies);
router.get("/:id", authMiddleware, policyController.getPolicyById);
router.post(
  "/:id/approve",
  authMiddleware,
  validate(PolicyApprovalSchema),
  policyController.approvePolicy
);

export default router;
