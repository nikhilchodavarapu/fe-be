import { Hono } from "hono";
import { serveStatic } from "hono/deno";
import { handleRegister } from "./handlers/register-handler.js";
import { handlePost } from "./handlers/post-handler.js";
import { setCookie } from "hono/cookie";
import { logger } from "hono/logger";

export const createApp = () => {
  const app = new Hono();

  app.use(logger());
  app.post("/addPost", handlePost);

  app.post("/validate", async (c) => {
    const request = await c.req.formData();
    console.log(request);
    const { username, password } = Object.fromEntries(request.entries());
    const users = JSON.parse(Deno.readTextFileSync("./data/users.json"));
    const isValidUser = users.some(({ username: name, "new-password": pass }) =>
      name === username && password === pass
    );
    if (!isValidUser) return c.redirect("/", 303);
    setCookie(c, "username", username);
    return c.redirect("/something.html", 303);
  });
  app.post("/register", handleRegister);
  app.get("*", serveStatic({ root: "./public" }));
  return app;
};
