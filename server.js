import { createApp } from "./src/app.js";

const main = () => {
  const app = createApp();
  Deno.serve({ port: 8080 }, app.fetch);
};

main();
