import express from "express";
import postRoute from "./routes/posts.js";
import usersRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/posts", postRoute);
app.use("/api/users", usersRoute);
app.use("/users/auth", authRoute);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
