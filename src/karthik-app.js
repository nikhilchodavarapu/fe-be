const serveHomePage = (_req) => {
  const responsePage = Deno.readTextFileSync("./index.html");
  const headers = new Headers();

  headers.append("content-type", "text/html");
  return new Response(responsePage, { status: 200, headers });
};

const writeToFiles = async (files) => {
  await Promise.all(files.map(async ([_, fileObject]) => {
    const file = await Deno.open(`./uploads/${fileObject.name}`, {
      write: true,
      create: true,
    });
    await fileObject.stream().pipeTo(file.writable);
  }));
};

const saveFile = async (req) => {
  const request = await req.formData();
  const files = Object.entries(Object.fromEntries(request));

  await writeToFiles(files);
  const response = "<h1>hello</h1>";

  const headers = new Headers();
  headers.append("content-type", "text/html");

  return new Response(response, { status: 200, headers });
};

const routes = {
  "/": serveHomePage,
  "/upload": saveFile,
};

export const requestHandler = async (request) => {
  const path = new URL(request.url).pathname;
  console.log(path);

  const route = routes[path];
  if (!route) {
    const response = "<h1>Not found</h1>";
    const headers = new Headers();

    headers.append("content-type", "text/html");
    return new Response(response, { status: 404, headers });
  }

  return await route(request);
};