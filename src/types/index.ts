import { z } from "zod";

export const PolicySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Policy name is required"),
  type: z.string().min(1, "Policy type is required"),
  content: z.string().min(1, "Policy content is required"),
  version: z.number().int().positive(),
  is_active: z.boolean().default(false),
  company_id: z.number().int().positive(),
  template_id: z.number().int().positive().optional(),
  approved_by: z.string().optional(),
  approval_date: z.date().optional(),
  policyRoles: z.array(z.string().min(1)).optional(),
  configurations: z
    .array(
      z.object({
        config_key: z.string().min(1),
        config_value: z.string(),
      })
    )
    .optional(),
  acknowledgements: z
    .array(
      z.object({
        employee_id: z.number().int().positive(),
        acknowledged_at: z.date().optional(),
        status: z.enum(["acknowledged", "not_acknowledged"]),
        version: z.number().int().positive(),
        acknowledgement_type: z.enum(["new_hire", "periodic", "manual"]),
        is_within_30_days: z.boolean(),
        due_date: z.date(),
        acknowledgement_request_date: z.date().optional(),
        is_escalated: z.boolean().optional(),
        triggered_by: z.number().int().positive().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
});

export const PolicyApprovalSchema = z.object({
  approved_by: z.string().min(1, "Approver is required"),
  status: z.enum(["accepted", "declined"]),
});

export const AcknowledgementRequestSchema = z.object({
  user_id: z.number().int().positive(),
  policy_id: z.number().int().positive().min(1),
  acknowledgement_type: z.enum(["new_hire", "periodic", "manual"]),
  status: z.enum(["pending", "acknowledged", "not_acknowledged"]).optional(),
  version: z.number().int().positive().default(1),
  is_within_30_days: z.boolean().default(false),
  due_date: z.date(),
  acknowledgement_request_date: z.date().optional(),
  is_escalated: z.boolean().default(false),
  triggered_by: z.string().optional(),
});

export const AcknowledgePolicySchema = z.object({
  employee_id: z.number().int().positive(),
  policy_id: z.number().int().positive(),
  version: z.number().int().positive(),
  acknowledged_at: z.date().optional(),
  acknowledged_by: z.string().optional(),
  status: z.enum(["acknowledged", "not_acknowledged"]),
  is_within_30_days: z.boolean().optional(),
  notes: z.string().optional(),
});

export const PolicyTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").optional(),
  type: z.string().min(1, "Template type is required").optional(),
  default_content: z.string().min(1, "Template content is required").optional(),
  version: z.number().int().positive().default(1).optional(),
  is_active: z.boolean().default(true).optional(),
  created_by: z.string().optional(),
  policies: z.array(PolicySchema).optional(),
});

export const JoinCompanySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  company_id: z.number().int().positive("Company ID must be positive"),
  role: z
    .enum(["employee", "manager", "admin", "cto", "hr"])
    .default("employee"),
});


export const AcknowledgePoliciesSchema = z.object({
  employee_id: z.number().int().positive(),  
  policy_ids: z.array(z.number().int().positive()), 
  acknowledged_by: z.string().optional().optional(),
});

export type AcknowledgePoliciesInput = z.infer<
  typeof AcknowledgePoliciesSchema
>;

export type PolicyTemplateInput = z.infer<typeof PolicyTemplateSchema>;
export type PolicyInput = z.infer<typeof PolicySchema>;
export type PolicyApprovalInput = z.infer<typeof PolicyApprovalSchema>;
export type AcknowledgementRequestInput = z.infer<
  typeof AcknowledgementRequestSchema
>;
export type AcknowledgePolicyInput = z.infer<typeof AcknowledgePolicySchema>;
export type JoinCompanyInput = z.infer<typeof JoinCompanySchema>;

export interface ApiError extends Error {
  status?: number;
  code?: string;
}
