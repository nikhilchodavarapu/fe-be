import { Hono } from "hono";
import { serveStatic } from "hono/deno";

export const createApp = () => {
  const app = new Hono();

  app.get("*", serveStatic({ root: "/public/register.html" }));
  return app;
};
