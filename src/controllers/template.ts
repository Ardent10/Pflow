import { Request, Response } from "express";
import * as templateService from "../services/template";
import { PolicyTemplateInput } from "../types";
import { BadRequestError } from "../middleware/errorHandler";

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new BadRequestError("Uauthorized");
    }

    const data: PolicyTemplateInput = req.body || {};
    const template = await templateService.createTemplateAndPolicies(
      user.id,
      user.company_id,
      data
    );

    return res.status(201).json({
      message: "Template created successfully",
      template,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Error creating template: ${error.message}` });
  }
};

export const getTemplates = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const templates = await templateService.getTemplates(
      type as string | undefined
    );
    return res.status(200).json(templates);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Error fetching templates: ${error.message}` });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const template = await templateService.getTemplateById(id);
    return res.status(200).json(template);
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: `Error fetching template: ${error.message}` });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data: PolicyTemplateInput = req.body;
    const template = await templateService.updateTemplate(id, data);
    return res.status(200).json({
      message: "Template updated successfully",
      template,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Error updating template: ${error.message}` });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await templateService.deleteTemplate(id);
    return res.status(200).json({ message: "Template deleted successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Error deleting template: ${error.message}` });
  }
};

export const approveTemplateAndPolicies = async (
  req: Request,
  res: Response
) => {
  try {
    const templateId = parseInt(req.params.id);
    const user = req.user;

    if (!user) {
      throw new BadRequestError("Uauthorized");
    }

    const result = await templateService.approveTemplateAndPolicies(
      user.id,
      templateId
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPendingApprovalTemplates = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Unauthorized.");
    }

    const result = await templateService.getPendingApprovalTemplates(
      user.id,
      user.company_id
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
