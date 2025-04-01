import prisma from "../config/db";
import { NotFoundError } from "../middleware/errorHandler";
import {
  AcknowledgementRequestInput,
  AcknowledgePoliciesInput,
  AcknowledgePolicyInput,
} from "../types";

export const requestAcknowledgements = async (
  data: AcknowledgementRequestInput
) => {
  try {
    if (!data.user_id || !data.policy_id) {
      throw new Error("No user id was provided to request acknowledgement.");
    }

    const acknowledgement = await prisma.policyAcknowledgement.create({
      data: {
        user_id: data.user_id,
        policy_id: data.policy_id,
        acknowledgement_type: data.acknowledgement_type,
        is_within_30_days: data.is_within_30_days,
        acknowledgement_request_date: new Date(),
        status: "not_acknowledged",
        version: 1,
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
      },
    });

    return acknowledgement;
  } catch (error) {
    throw new Error(
      `Error creating acknowledgement: ${(error as Error).message}`
    );
  }
};

export const getPendingAcknowledgements = async (
  employeeId?: number,
  policyId?: number
) => {
  try {
    // Build the filter for the query
    const filter: any = {
      acknowledged_at: null,
    };
    if (employeeId) filter.user_id = employeeId;
    if (policyId) filter.policy_id = policyId;

    // Fetch pending acknowledgements with associated policy and template
    const pendingAcknowledgements = await prisma.policyAcknowledgement.findMany(
      {
        where: filter,
        include: {
          policy: {
            include: {
              template: true,
            },
          },
        },
      }
    );

    // Group policies by template using a Map for better performance
    const templateMap = new Map<number, any>();

    pendingAcknowledgements.forEach((ack) => {
      const { policy } = ack;
      const template = policy.template;

      // Skip if no template found
      if (!template) return;

      // If template is not already in the map, initialize it
      if (!templateMap.has(template.id)) {
        templateMap.set(template.id, {
          ...template,
          policies: [],
        });
      }

      // Add policy to the corresponding template's policy list
      templateMap.get(template.id).policies.push(policy);
    });

    // Convert the map to an array of grouped data
    const result = Array.from(templateMap.values());

    return result;
  } catch (error: any) {
    throw new Error(
      `Error retrieving pending acknowledgements: ${error.message}`
    );
  }
};

export const acknowledgePolicy = async (
  id: number,
  employeeId: number,
  policyId: number
) => {
  try {
    const acknowledgement = await prisma.policyAcknowledgement.update({
      where: { id },
      data: {
        acknowledged_at: new Date(),
        user_id: employeeId,
        policy_id: policyId,
      },
    });
    return acknowledgement;
  } catch (error: any) {
    throw new Error(`Error acknowledging policies: ${error.message}`);
  }
};

export const acknowledgePolicies = async (data: AcknowledgePoliciesInput) => {
  try {
    // Step 1: Validate input data
    if (
      !data.employee_id ||
      !Array.isArray(data.policy_ids) ||
      data.policy_ids.length === 0
    ) {
      throw new Error(
        "Invalid input data: Employee ID and Policy IDs are required"
      );
    }

    const policiesToAcknowledge = await prisma.policyAcknowledgement.findMany({
      where: {
        user_id: data.employee_id,
        policy_id: { in: data.policy_ids },
        acknowledged_at: null,
        status: "not_acknowledged",
      },
    });

    if (policiesToAcknowledge.length === 0) {
      throw new NotFoundError(
        "No pending policies to acknowledge for the given employee and policies"
      );
    }

    // Step 3: Calculate is_within_30_days for each policy
    const updatedPolicies = policiesToAcknowledge.map((policy) => {
      const acknowledgementRequestDate = policy.acknowledgement_request_date
        ? new Date(policy.acknowledgement_request_date)
        : new Date();

      const isWithin30Days =
        acknowledgementRequestDate.getTime() >=
        new Date().setDate(new Date().getDate() - 30);

      return {
        policy_id: policy.policy_id,
        is_within_30_days: isWithin30Days,
      };
    });

    // Step 4: Perform the update operation based on the calculated values
    const acknowledgements = await prisma.policyAcknowledgement.updateMany({
      where: {
        user_id: data.employee_id,
        policy_id: { in: data.policy_ids },
        acknowledged_at: null,
        status: "not_acknowledged",
      },
      data: {
        acknowledged_at: new Date(),
        status: "acknowledged",
        is_within_30_days: true,
      },
    });

    if (acknowledgements.count === 0) {
      throw new Error("No policies were acknowledged");
    }

    // Step 5: Update is_within_30_days for the acknowledged policies
    for (const policy of updatedPolicies) {
      await prisma.policyAcknowledgement.updateMany({
        where: {
          user_id: data.employee_id,
          policy_id: policy.policy_id,
          acknowledged_at: { not: null },
        },
        data: {
          is_within_30_days: policy.is_within_30_days,
        },
      });
    }

    return acknowledgements;
  } catch (error: any) {
    throw new Error(`Error acknowledging policies: ${error.message}`);
  }
};

export const getAcknowledgementById = async (id: number) => {
  try {
    const acknowledgement = await prisma.policyAcknowledgement.findUnique({
      where: { id },
    });
    return acknowledgement;
  } catch (error: any) {
    throw new Error(`Error retrieving acknowledgement by ID: ${error.message}`);
  }
};

export const getOverdueAcknowledgements = async () => {
  try {
    const overdueAcknowledgements = await prisma.policyAcknowledgement.findMany(
      {
        where: {
          acknowledged_at: null,
          status: "not_acknowledged",
          acknowledgement_request_date: {
            lt: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
        include: {
          user: true,
          policy: {
            include: {
              template: true,
            },
          },
        },
      }
    );

    const templateMap = new Map<number, any>();

    overdueAcknowledgements.forEach((ack) => {
      const { policy } = ack;
      const template = policy?.template;

      if (!template) return;

      if (!templateMap.has(template.id)) {
        templateMap.set(template.id, {
          ...template,
          policies: [],
        });
      }

      templateMap.get(template.id).policies.push(policy);
    });

    const result = Array.from(templateMap.values());

    return result;
  } catch (error: any) {
    throw new Error(
      `Error retrieving overdue acknowledgements: ${error.message}`
    );
  }
};
