import { Router } from "express";
import { validate } from "../middleware/validator";
import {
  AcknowledgementRequestSchema,
  AcknowledgePoliciesSchema,
  AcknowledgePolicySchema,
} from "../types";
import * as acknowledgementController from "../controllers/acknowledgement";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post(
  "/",
  validate(AcknowledgementRequestSchema),
  acknowledgementController.requestAcknowledgements
);
router.get(
  "/pending",
  authMiddleware,
  acknowledgementController.getPendingAcknowledgements
);
router.get(
  "/overdue",
  authMiddleware,
  acknowledgementController.getOverdueAcknowledgements
);
router.post(
  "/acknowledge",
  authMiddleware,
  acknowledgementController.acknowledgePolicies
);
router.post(
  "/:id/acknowledge",
  authMiddleware,
  validate(AcknowledgePolicySchema),
  acknowledgementController.acknowledgePolicy
);

export default router;
