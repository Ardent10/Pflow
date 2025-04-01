import prisma from "../config/db";
import bcrypt from "bcrypt";

export const register = async (data: any) => {
  const { company_id, name, email, password, role_id } = data;

  // Check for existing user
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  let finalRoleId = role_id;
  let company;

  // Check if company exists
  if (company_id) {
    company = await prisma.company.findUnique({
      where: { id: company_id },
    });
  }

  if (!company) {
    // If company does not exist, create a new one
    const newCompany = await prisma.company.create({
      data: {
        name: `${name}'s Company`,
        domain: email.split("@")[1],
      },
    });

    // Assign the role as CTO since this is the first user of the company
    const ctoRole = await prisma.role.create({
      data: {
        company_id: newCompany.id,
        name: "cto",
        team: "admin",
      },
    });

    finalRoleId = ctoRole.id;
  } else if (company && !role_id) {
    // If company exists but no role is provided, throw an error
    throw new Error("Role ID is required for existing companies");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await prisma.user.create({
    data: {
      company_id: company ? company.id : finalRoleId,
      name,
      email,
      password: hashedPassword,
      role_id: finalRoleId,
      joining_date: new Date(),
    },
  });

  return user;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      joining_date: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return user;
};

export const getProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      joining_date: true,
      role: {
        select: {
          id: true,
          name: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");
  return user;
};

export const joinCompany = async (data: any) => {
  const { name, email, password, company_id, role, team } = data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  const company = await prisma.company.findUnique({
    where: { id: company_id },
  });

  if (!company) throw new Error("Company not found");

  const userRole = await prisma.role.create({
    data: {
      name: role,
      company_id,
      team,
    },
  });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      company_id,
      role_id: userRole.id,
      joining_date: new Date(),
    },
  });

  return user;
};
