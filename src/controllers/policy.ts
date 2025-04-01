import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../middleware/errorHandler";
import * as policyService from "../services/policy";
import { PolicyInput, PolicyApprovalInput } from "../types";

// Create a new policy
export const createPolicy = async (req: Request, res: Response) => {
  const policyData: PolicyInput = req.body;
  try {
    const policy = await policyService.createPolicy(policyData);
    res.status(201).json(policy);
  } catch (error) {
    throw new BadRequestError((error as Error).message);
  }
};

// Get policies by company ID with an active-only filter
export const getPolicies = async (req: Request, res: Response) => {
  const companyId = Number(req.query.company_id);
  const activeOnly = req.query.active_only === "true";

  if (!companyId) {
    throw new BadRequestError("Company ID is required");
  }

  try {
    const policies = await policyService.getPoliciesByCompany(
      companyId,
      activeOnly
    );
    res.json(policies);
  } catch (error) {
    throw new BadRequestError((error as Error).message);
  }
};

// Get a policy by ID
export const getPolicyById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const policy = await policyService.getPolicyById(id);
    if (!policy) throw new NotFoundError("Policy not found");
    res.json(policy);
  } catch (error) {
    throw new NotFoundError((error as Error).message);
  }
};

// Approve a policy
export const approvePolicy = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { approved_by,status }: PolicyApprovalInput = req.body;

  try {
    const policy = await policyService.approvePolicy(id, approved_by,status);
    if (!policy) throw new NotFoundError("Policy not found");
    res.json(policy);
  } catch (error) {
    throw new NotFoundError((error as Error).message);  
  }
};
