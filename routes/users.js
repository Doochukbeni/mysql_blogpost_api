import express from "express";
import { addUser } from "../controller/users.js";

const router = express.Router();

router.get("/", addUser);

export default router;
