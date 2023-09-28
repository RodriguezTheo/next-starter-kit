import { User } from "@prisma/client";
import pick from "lodash/pick";
import prisma from "./prisma";
import { encryptPassword } from "./auth/passwordUtils";

export interface UserParams {
  mail: string;
  first_name: string;
  last_name: string;
  password: string;
  role: string;
}

export async function createUser(params: UserParams): Promise<User> {
  const filteredParams = pick(params, [
    "mail",
    "first_name",
    "last_name",
    "password"
  ]);
  const password = await encryptPassword(filteredParams.password);
  const user = await prisma.user.create({
    data: { ...filteredParams, password }
  });

  user.password = "";

  return user;
}
