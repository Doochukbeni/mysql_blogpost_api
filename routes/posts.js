import express from "express";
import { addPost } from "../controller/posts.js";

const router = express.Router();

router.get("/", addPost);

export default router;
