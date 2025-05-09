import argon2 from "argon2";

export async function hashUserPassword(password) {
  return await argon2.hash(password, {
    type: argon2.argon2id,
  });
}

export async function verifyPassword(hashedPassword, password) {
  return await argon2.verify(hashedPassword, password);
}
