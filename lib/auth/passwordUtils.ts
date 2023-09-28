import * as argon2 from "argon2";

export async function encryptPassword(password: string): Promise<string> {
  const hashingOptions = {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 5,
    parallelism: 1
  };
  return await argon2.hash(password, hashingOptions);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}
