export const saveImage = async (path, imageData) => {
  const file = await Deno.open(path, { create: true, write: true });

  await imageData.stream().pipeTo(file.writable);
};

export const savePost = (filePath, postInfo) =>
  fetch(filePath)
    .then((x) => x.json())
    .then(async (data) => {
      data.push(postInfo);
      await Deno.writeTextFile(JSON.stringify(data, "", 2));
    });

export const handlePost = async (c) => {
  const req = await c.req.formData();
  const { userID } = c.cookie;
  const { content, imageData } = Object.fromEntries(req.entries());
  const imgData = JSON.parse(imageData);

  const image_name = `${userName}-${imgData.name}`;
  const imgPath = `/data/post-images/${image_name}`;

  const postInfo = { userID, content, imgPath };
  const postsPath = `/data/posts/all.posts.json`;

  await saveImage(imgPath, imgData);
  await savePost(postsPath, postInfo);
};

const imageData = {
  name: "newClick.jpg",
  type: "image/jpg",
};

const form = new FormData();
form.append("content", "hello");
form.append("imageData", JSON.stringify(imageData));

const userName = "nameisnani";

const myC = {
  req: { formData: async () => await form },
  cookie: { userID: userName },
};

handlePost(myC);
