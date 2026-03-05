import { getCookie } from "hono/cookie";

export const saveImage = async (path, imageData) => {
  const file = await Deno.open(path, { create: true, write: true });

  await imageData.stream().pipeTo(file.writable);
};

export const savePost = (filePath, postInfo) => {
  const posts = JSON.parse(Deno.readTextFileSync(filePath));
  posts.push(postInfo);
  Deno.writeTextFileSync(filePath, JSON.stringify(posts));
};

export const handlePost = async (c) => {
  const req = await c.req.formData();
  // console.log(req);
  const username = getCookie(c).username;
  const { comment, "post-image": imageData } = Object.fromEntries(
    req.entries(),
  );

  const image_name = `${username}-${imageData.name}`;
  const imgPath = `./data/posts/${image_name}`;

  const postInfo = { username, comment, imgPath };
  const postsPath = `./data/all-posts.json`;

  await saveImage(imgPath, imageData);
  await savePost(postsPath, postInfo);
  return c.text("hello");
};
