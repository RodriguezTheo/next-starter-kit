import { serialize } from "cookie";
import { IncomingMessage, ServerResponse } from "http";
import jwt from "jsonwebtoken";
import { NextApiResponse } from "next";
import { User } from "@prisma/client";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
import prisma from "../../backend/prisma";

const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY;

const cookieOptions = {
  httpOnly: true,
  maxAge: 2592000,
  path: "/",
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production"
};

function setCookie(
  res: ServerResponse,
  name: string,
  value: string | Record<string, unknown>,
  options = {}
): void {
  const stringValue =
    typeof value === "object" ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader("Set-Cookie", serialize(name, String(stringValue), options));
}

export function authenticateUser(res: NextApiResponse, user: User) {
  if (!user || !JWT_TOKEN_KEY) return;

  const token = jwt.sign({ mail: user.mail }, JWT_TOKEN_KEY, {
    expiresIn: "1d"
  });

  setCookie(res, "auth", token, cookieOptions);
}

export function clearUser(res: NextApiResponse): void {
  setCookie(res, "auth", "0", {
    ...cookieOptions,
    path: "/",
    maxAge: 1
  });
}

export async function userFromRequest(
  req: IncomingMessage & { cookies: NextApiRequestCookies }
): Promise<User | undefined> {
  const { auth: token } = req.cookies;
  if (!token || !JWT_TOKEN_KEY) return undefined;

  try {
    const data = jwt.verify(token, JWT_TOKEN_KEY);
    if (!data) return undefined;

    const user = await prisma.user.findUnique({
      where: {
        mail: (data as User).mail
      }
    });

    if (!user) return undefined;

    user.password = "";
    return user;
  } catch (error) {
    return undefined;
  }
}
