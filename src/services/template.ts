import { User } from "@prisma/client";
import prisma from "../config/db";
import { PolicyInput, PolicyTemplateInput } from "../types";
import { BadRequestError } from "../middleware/errorHandler";
import * as policyService from "./policy";

export const createTemplateAndPolicies = async (
  user: User,
  data?: PolicyTemplateInput
) => {
  try {
    return await prisma.$transaction(
      async (prisma) => {
        if (!user.company_id) {
          throw new Error("Company ID is missing or invalid.");
        }

        const companyExists = await prisma.company.findUnique({
          where: { id: user.company_id },
        });

        if (!companyExists) {
          throw new Error(`Company with ID ${user.company_id} does not exist.`);
        }

        // Default SOC2 Compliance template data
        const defaultTemplateData = {
          name: "SOC2 Compliance",
          type: "Compliance",
          version: 0,
          default_content: "SOC2 Compliance Template",
          is_active: false,
          created_by: user.id.toString(),
          company_id: user.company_id,
        };

        const templateData = {
          name: data?.name ?? defaultTemplateData.name,
          type: data?.type ?? defaultTemplateData.type,
          version: data?.version ?? defaultTemplateData.version,
          default_content:
            data?.default_content ?? defaultTemplateData.default_content,
          is_active: false,
          created_by: data?.created_by ?? user.id.toString(),
          company_id: user.company_id,
        };

        // Create the template in policyTemplate table
        const template = await prisma.policyTemplate.create({
          data: templateData,
          include: { policies: true },
        });

        // Prepare policies to be created (both for default and custom)
        const policiesToCreate = data?.policies ?? [
          {
            company_id: user.company_id,
            template_id: template.id,
            name: "Access Control Policy",
            type: "Security",
            content: "Defines access control measures.",
            version: 0,
            is_active: false,
            policyRoles: ["sales", "engineering", "hr"],
          },
          {
            company_id: user.company_id,
            template_id: template.id,
            name: "Data Retention Policy",
            type: "Data",
            content: "Specifies how data is stored and deleted.",
            version: 0,
            is_active: false,
            policyRoles: ["sales", "engineering", "hr"],
          },
          {
            company_id: user.company_id,
            template_id: template.id,
            name: "Incident Response Policy",
            type: "Incident",
            content: "Guidelines on how to handle security incidents.",
            version: 0,
            is_active: false,
            policyRoles: ["engineering"],
          },
          {
            company_id: user.company_id,
            template_id: template.id,
            name: "Change Management Policy",
            type: "Governance",
            content:
              "Outlines procedures for managing changes in systems and processes.",
            version: 0,
            is_active: false,
            policyRoles: ["sales", "hr"],
          },
          {
            company_id: user.company_id,
            template_id: template.id,
            name: "Business Continuity Plan",
            type: "Continuity",
            content: "Ensures continued operation during and after a disaster.",
            version: 0,
            is_active: false,
            policyRoles: ["sales", "hr"],
          },
        ];

        // Create policies within the transaction context
        for (const policy of policiesToCreate) {
          await policyService.createPolicy(policy, prisma);
        }

        return template;
      },
      {
        timeout: 10000,
      }
    );
  } catch (error: any) {
    console.error("Error in createTemplateAndPolicies:", error); // Log error for debugging
    throw new Error(`Error creating template and policies: ${error.message}`);
  }
};

export const getTemplates = async (type?: string) => {
  try {
    const templates = await prisma.policyTemplate.findMany({
      where: type ? { type } : {},
    });
    return templates;
  } catch (error: any) {
    throw new Error(`Error fetching templates: ${error.message}`);
  }
};

export const getTemplateById = async (id: number) => {
  try {
    const template = await prisma.policyTemplate.findUnique({
      where: { id },
    });
    if (!template) throw new Error("Template not found");
    return template;
  } catch (error: any) {
    throw new Error(`Error fetching template by ID: ${error.message}`);
  }
};

export const updateTemplate = async (id: number, data: PolicyTemplateInput) => {
  try {
    const { policies, ...templateData } = data;

    const template = await prisma.policyTemplate.update({
      where: { id },
      data: {
        ...templateData,
        policies: policies
          ? {
              upsert: policies.map((policy) => ({
                where: { id: policy.id },
                update: {
                  name: policy.name,
                  type: policy.type,
                  content: policy.content,
                  version: policy.version,
                  is_active: policy.is_active,
                },
                create: {
                  name: policy.name,
                  type: policy.type,
                  content: policy.content,
                  version: policy.version,
                  is_active: policy.is_active ?? true,
                  company_id: policy.company_id,
                },
              })),
            }
          : undefined,
      },
    });

    return template;
  } catch (error: any) {
    throw new Error(`Error updating template: ${error.message}`);
  }
};

export const deleteTemplate = async (id: number) => {
  try {
    await prisma.policyTemplate.delete({
      where: { id },
    });
    return { message: "Template deleted successfully" };
  } catch (error: any) {
    throw new Error(`Error deleting template: ${error.message}`);
  }
};

export const getPendingApprovalTemplates = async (user: User) => {
  try {
    if (!user) {
      throw new Error("Unauthorized.");
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    if (userWithRole?.role.name !== "cto") {
      throw new Error(
        "Unauthorized: Only users with the CTO role can view templates and policies needing approval."
      );
    }

    const pendingTemplates = await prisma.policyTemplate.findMany({
      where: {
        is_active: false,
        company_id: user.company_id,
      },
      include: {
        policies: {
          where: { is_active: false },
          include: {
            policy_role_mappings: {
              select: {
                id: true,
                name: true,
                policy_id: true,
              },
            },
          },
        },
      },
    });

    return {
      message:
        "Pending approval templates and their policies fetched successfully",
      templates: pendingTemplates,
    };
  } catch (error: any) {
    throw new Error(
      `Error fetching pending approval templates and policies: ${error.message}`
    );
  }
};
export const approveTemplateAndPolicies = async (
  user: User,
  templateId: number
) => {
  try {
    if (!user) {
      throw new BadRequestError("Unauthorized.");
    }

    const userWithRole = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        role: true,
      },
    });

    if (userWithRole?.role.name !== "cto") {
      throw new Error(
        "Unauthorized: Only users with the CTO role can approve templates and policies."
      );
    }

    // Fetch the template to ensure it exists
    const template = await prisma.policyTemplate.findUnique({
      where: { id: templateId },
      include: { policies: true },
    });

    if (!template) {
      throw new Error(`Template with ID ${templateId} not found.`);
    }

    // Approve the template and all related policies
    const approvedTemplate = await prisma.policyTemplate.update({
      where: { id: templateId },
      data: {
        is_active: true,
        policies: {
          updateMany: {
            where: {},
            data: { is_active: true },
          },
        },
      },
    });

    // Approve each policy related to the template and request acknowledgements for employees
    for (const policy of template.policies) {
      await policyService.approvePolicy(
        policy.id,
        user.id.toString(),
        "accepted"
      );
    }

    return {
      message: "Template and related policies approved successfully",
      template: approvedTemplate,
    };
  } catch (error: any) {
    throw new Error(`Error approving template and policies: ${error.message}`);
  }
};
