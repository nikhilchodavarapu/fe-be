import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { handleRegister } from "./handlers/register-handler.js";

export const createApp = () => {
  const app = new Hono();

  app.post("/validate", async (c) => {
    const request = await c.req.formData();
    console.log(request);
    const { username, password } = Object.fromEntries(request.entries());
    const users = JSON.parse(Deno.readTextFileSync("./data/users.json"));
    const isValidUser = users.some(({ username: name, "new-password": pass }) =>
      name === username && password === pass
    );
    if (isValidUser) return c.text("HELLO");
    return c.text("INVALID");
  });
  app.post("/register", handleRegister);
  app.get("*", serveStatic({ root: "./public" }));
  return app;
};
