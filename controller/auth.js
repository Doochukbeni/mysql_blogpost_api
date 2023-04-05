import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  // CHECK IF USER ALREADY EXIST IN DB

  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [email, username], (error, data) => {
    if (error) return res.json(error);
    if (data.length) return res.json("user already exist");
    if (!email || !username || !password) return res.json("invalid entry");

    //   HASH USER PASSWORD USING BCRYPTJS
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // CREATE NEW USER

    const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";

    const values = [username, email, hash];

    db.query(q, [values], (error, data) => {
      if (error) return res.json(error);
      return res.json("user created");
    });
  });
};

export const login = (req, res) => {
  const email = req.body.email;

  if (!email || !req.body.password) {
    return res.status(400).json({ message: "email and password is required" });
  }

  // CHECKING FOR USER IN DB
  const q = "SELECT * FROM users WHERE email = ? ";

  db.query(q, [email], (error, data) => {
    if (error) return res.json(error);
    if (data.length === 0) return res.status(404).json("user not found");

    // CHECK PASSWORD USING BCRYPT

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("wrong email or password");

    // CREATE JWT ACCESS TOKEN

    const accessToken = jwt.sign(
      { email: data[0].email },
      process.env.JWT_SECRET,
      {
        expiresIn: "90m",
      }
    );

    const refreshToken = jwt.sign(
      { email: data[0].email },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const { password, ...other } = data[0];
    res.cookie("access_token", JSON.stringify(refreshToken), {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken, other });
  });
};
export const logOut = (req, res) => {
  res.json("user is authenticated");
};
