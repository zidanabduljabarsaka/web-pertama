import { Elysia } from "elysia";
import { usersRoute } from "./routes/users-route";
import { db } from "./db";
import { users } from "./db/schema";

const app = new Elysia()
  .use(usersRoute)
  .get("/", () => ({ status: "ok", message: "Elysia server is running" }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return allUsers;
    } catch (error) {
      return { error: "Database connection failed or table does not exist" };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
