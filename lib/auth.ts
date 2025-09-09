import { createHash, randomBytes } from "crypto";
import { db } from "./db";
import { users, leads } from "./db/schema";
import { eq } from "drizzle-orm";

export interface User {
  id: string;
  email: string;
  role: "admin" | "student";
  name?: string;
  leadId?: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return createHash("sha256").update(password).digest("hex");
}

export async function generateToken(): Promise<string> {
  return randomBytes(32).toString("hex");
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const hashedPassword = await hashPassword(password);

    // First check in users table
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return { success: false, error: "User not found" };
    }

    if (user[0].password !== hashedPassword) {
      return { success: false, error: "Invalid password" };
    }

    // If user is a student, get their lead information
    let leadInfo = null;
    if (user[0].role === "student") {
      const lead = await db
        .select()
        .from(leads)
        .where(eq(leads.email, email))
        .limit(1);
      leadInfo = lead[0] || null;
    }

    return {
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        role: user[0].role as "admin" | "student",
        name: leadInfo?.name,
        leadId: leadInfo?.id,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

export async function createUser(
  email: string,
  password: string,
  role: "admin" | "student" = "student"
): Promise<AuthResult> {
  try {
    const hashedPassword = await hashPassword(password);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" };
    }

    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role,
      })
      .returning();

    return {
      success: true,
      user: {
        id: newUser[0].id,
        email: newUser[0].email,
        role: newUser[0].role as "admin" | "student",
      },
    };
  } catch (error) {
    console.error("User creation error:", error);
    return { success: false, error: "Failed to create user" };
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (user.length === 0) {
      return null;
    }

    // If user is a student, get their lead information
    let leadInfo = null;
    if (user[0].role === "student") {
      const lead = await db
        .select()
        .from(leads)
        .where(eq(leads.email, user[0].email))
        .limit(1);
      leadInfo = lead[0] || null;
    }

    return {
      id: user[0].id,
      email: user[0].email,
      role: user[0].role as "admin" | "student",
      name: leadInfo?.name,
      leadId: leadInfo?.id,
    };
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
