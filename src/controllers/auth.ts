import { Request, Response } from "express";
import * as authService from "../services/auth";
import { generateToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    const token = generateToken(user.id, user.email, user.role_id);
    return res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = generateToken(user.id, user.email, user.role.id);
    return res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const user = await authService.getProfile(userId);
    return res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const joinCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, password, company_id, role, team } = req.body;

    const user = await authService.joinCompany({
      name,
      email,
      password,
      company_id,
      role,
      team,
    });

    return res
      .status(201)
      .json({ message: "Joined company successfully", user });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
