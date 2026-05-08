import { mysqlTable, serial, varchar, text, timestamp, int } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokens = mysqlTable("tokens", {
  id: serial("id").primaryKey(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userId: int("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

