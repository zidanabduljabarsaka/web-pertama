import { db } from "../db";
import { users, tokens } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
};

export const loginUser = async (data: any) => {
  const { email, password } = data;

  // Find user
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const foundUser = result[0];

  if (!foundUser) {
    throw new Error("Email atau password salah");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    throw new Error("Email atau password salah");
  }

  // Generate token
  const token = crypto.randomUUID();

  // Save token
  await db.insert(tokens).values({
    token,
    userId: foundUser.id,
  });

  return { data: token };
};


export const getCurrentUser = async (token: string) => {
  const session = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(tokens)
    .innerJoin(users, eq(tokens.userId, users.id))
    .where(eq(tokens.token, token))
    .limit(1);

  if (session.length === 0) {
    throw new Error("Unauthorized");
  }

  return { data: session[0] };
};

