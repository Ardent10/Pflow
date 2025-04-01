import { Request, Response } from "express";
import { NotFoundError, BadRequestError } from "../middleware/errorHandler";
import * as acknowledgementService from "../services/acknowledgement";
import { AcknowledgementRequestInput, AcknowledgePolicyInput } from "../types";

export const requestAcknowledgements = async (req: Request, res: Response) => {
  const acknowledgementData: AcknowledgementRequestInput = req.body;
  try {
    const acknowledgements =
      await acknowledgementService.requestAcknowledgements(acknowledgementData);
    res.status(201).json(acknowledgements);
  } catch (error) {
    throw new BadRequestError((error as Error).message);
  }
};

export const getPendingAcknowledgements = async (
  req: Request,
  res: Response
) => {
  const employeeId = Number(req.query.employee_id);
  const policyId = Number(req.query.policy_id);

  try {
    const pendingAcknowledgements =
      await acknowledgementService.getPendingAcknowledgements(
        employeeId,
        policyId
      );
    res.json(pendingAcknowledgements);
  } catch (error) {
    throw new BadRequestError((error as Error).message);
  }
};

export const acknowledgePolicy = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const acknowledgementData = req.body;

  try {
    const acknowledgement = await acknowledgementService.acknowledgePolicy(
      id,
      acknowledgementData.employee_id,
      acknowledgementData.policy_id
    );
    if (!acknowledgement) throw new NotFoundError("Acknowledgement not found");
    res.json(acknowledgement);
  } catch (error) {
    throw new NotFoundError((error as Error).message);
  }
};

export const acknowledgePolicies = async (req: Request, res: Response) => {
  const { employee_id, policy_ids } = req.body;


  try {
    const acknowledgements = await acknowledgementService.acknowledgePolicies({
      employee_id,
      policy_ids,
    });

    if (!acknowledgements || acknowledgements.count === 0) {
      return res
        .status(404)
        .json({ message: "No acknowledgements found or updated" });
    }

    res.status(200).json(acknowledgements);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Get acknowledgement by its ID
export const getAcknowledgementById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const acknowledgement =
      await acknowledgementService.getAcknowledgementById(id);
    if (!acknowledgement) throw new NotFoundError("Acknowledgement not found");
    res.json(acknowledgement);
  } catch (error) {
    throw new NotFoundError((error as Error).message);
  }
};

// Get overdue acknowledgements (overdue for more than 30 days)
export const getOverdueAcknowledgements = async (
  req: Request,
  res: Response
) => {
  try {
    const overdueAcknowledgements =
      await acknowledgementService.getOverdueAcknowledgements();
    if (!overdueAcknowledgements.length) {
      return res
        .status(404)
        .json({ message: "No overdue acknowledgements found" });
    }
    res.json(overdueAcknowledgements);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
