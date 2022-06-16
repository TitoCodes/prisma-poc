import express from "express";
import user from "./route/user.route";
import authentication from "./route/authentication.route";
import post from "./route/post.route";
const app = express();

app.use(express.json());

app.use("/", user);
app.use("/", authentication);
app.use("/", post);

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
