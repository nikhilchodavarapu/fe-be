import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const writeToFiles = async ({ username, "profile-image": fileObject }) => {
  console.log(fileObject);
  const file = await Deno.open(
    `./data/profile-pictures/${username}%${fileObject.name}`,
    {
      write: true,
      create: true,
    },
  );
  await fileObject.stream().pipeTo(file.writable);
};

const saveUserDetails = async (details) => {
  const users = JSON.parse(Deno.readTextFileSync("./data/users.json"));
  users.push({
    ...details,
    "profile-image": `${details.username}%${details["profile-image"].name}`,
  });
  const file = await Deno.open("./data/users.json", {
    write: true,
  });
  await file.write(new TextEncoder().encode(JSON.stringify(users)));
  await writeToFiles(details);
};

export const createApp = () => {
  const app = new Hono();

  app.post("/register", async (c) => {
    const request = await c.req.formData();
    const userInfo = Object.fromEntries(request.entries());
    saveUserDetails(userInfo);
    const response = "<h1>hello</h1>";

    const headers = new Headers();
    headers.append("content-type", "text/html");

    return new Response(response, { status: 200, headers });
  });
  app.get("*", serveStatic({ root: "./public" }));
  return app;
};
