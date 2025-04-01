import prisma from "../config/db";
import { PolicyInput, PolicyApprovalInput } from "../types";
import * as acknowledgementService from "./acknowledgement";

export const createPolicy = async (
  policyData: PolicyInput,
  prismaInstance?: any
) => {
  try {
    const policy = await prismaInstance.policy.create({
      data: {
        company_id: policyData.company_id,
        name: policyData.name,
        type: policyData.type,
        content: policyData.content,
        version: policyData.version,
        is_active: policyData.is_active,
        configurations: policyData.configurations
          ? {
              create: policyData.configurations.map((config) => ({
                config_key: config.config_key,
                config_value: config.config_value,
              })),
            }
          : undefined,
        acknowledgements: policyData.acknowledgements
          ? {
              create: policyData.acknowledgements.map((ack) => ({
                employee_id: ack.employee_id,
                acknowledged_at: ack.acknowledged_at,
                status: ack.status,
                version: ack.version,
                acknowledgement_type: ack.acknowledgement_type,
                is_within_30_days: ack.is_within_30_days,
                due_date: ack.due_date,
                acknowledgement_request_date:
                  ack.acknowledgement_request_date ?? new Date(),
                is_escalated: ack.is_escalated ?? false,
                triggered_by: ack.triggered_by,
              })),
            }
          : undefined,
      },
    });

    // Create associated policy role mappings if provided
    if (policyData.policyRoles && policyData.policyRoles.length > 0) {
      for (const policyRole of policyData.policyRoles) {
        await prismaInstance.policyRoleMapping.create({
          data: {
            policy_id: policy.id,
            name: policyRole,
          },
        });
      }
    }

    return policy;
  } catch (error: any) {
    throw new Error(`Error creating policy: ${error.message}`);
  }
};

export const getPoliciesByCompany = async (
  companyId: number,
  activeOnly: boolean
) => {
  try {
    const policies = await prisma.policy.findMany({
      where: {
        company_id: companyId,
        ...(activeOnly ? { is_active: true } : {}),
      },
      include: {
        configurations: true,
        acknowledgements: true,
      },
    });
    return policies;
  } catch (error: any) {
    throw new Error(`Error fetching policies: ${error.message}`);
  }
};

export const getPolicyById = async (id: number) => {
  try {
    const policy = await prisma.policy.findUnique({
      where: { id },
      include: {
        configurations: true,
        acknowledgements: true,
      },
    });
    if (!policy) throw new Error("Policy not found");
    return policy;
  } catch (error: any) {
    throw new Error(`Error fetching policy by ID: ${error.message}`);
  }
};

export const approvePolicy = async (
  id: number,
  approvedBy: string,
  status: "accepted" | "declined"
) => {
  try {
    const policy = await prisma.policy.update({
      where: { id },
      data: {
        approved_by: approvedBy,
        approval_date: new Date(),
        is_active: status === "accepted",
      },
    });

    // Deactivate older versions of the policy if it's accepted
    if (status === "accepted") {
      await prisma.policy.updateMany({
        where: {
          id: { not: id },
          company_id: policy.company_id,
          name: policy.name,
          type: policy.type,
          is_active: true,
        },
        data: { is_active: false },
      });

      const roleMappings = await prisma.policyRoleMapping.findMany({
        where: { policy_id: policy.id },
        include: {
          Role: true,
        },
      });

      const roleTeams = roleMappings
        .map((mapping) => mapping.name)
        .filter((team) => team !== undefined) as string[];

      const users = await prisma.user.findMany({
        where: {
          company_id: policy.company_id,
          role: {
            name: "employee",
            team: { in: roleTeams },
          },
        },
      });

      const userIds = users.map((user) => user.id);

      // Send acknowledgment requests for each relevant user
      for (const userId of userIds) {
        await acknowledgementService.requestAcknowledgements({
          user_id: userId,
          policy_id: policy.id,
          version: policy.version,
          acknowledgement_type: "manual",
          status: "pending",
          is_within_30_days: false,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          acknowledgement_request_date: new Date(),
          is_escalated: false,
          triggered_by: approvedBy,
        });
      }
    }

    return policy;
  } catch (error: any) {
    throw new Error(`Error approving policy: ${error.message}`);
  }
};

export const getActivePolicyVersion = async (
  companyId: number,
  type: string
) => {
  try {
    return prisma.policy.findFirst({
      where: {
        company_id: companyId,
        type: type,
        is_active: true,
      },
      orderBy: { version: "desc" },
    });
  } catch (error: any) {
    throw new Error(`Error fetching active policy version: ${error.message}`);
  }
};
