import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Please add it to your .env.local file."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload as unknown as JWTPayload;
}

/**
 * Extracts and verifies the Bearer token from the Authorization header.
 * Returns the decoded payload or throws if invalid/missing.
 */
export async function requireAuth(req: NextRequest): Promise<JWTPayload> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Missing or invalid Authorization header");
  }
  const token = authHeader.slice(7);
  return verifyToken(token);
}
