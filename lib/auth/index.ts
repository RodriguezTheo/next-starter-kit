import { User } from "@prisma/client";
import prisma from "../prisma";
import { verifyPassword } from "./passwordUtils";

export interface LoginParams {
  mail: string;
  password: string;
}

export async function login(params: LoginParams): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { mail: params.mail } });

  if (!user) {
    return user;
  }

  if (await verifyPassword(user.password, params.password)) {
    user.password = "";
    return user;
  }
  return null;
}
