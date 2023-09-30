import express from "express";
import { createUser, getUserByEmail } from "../db/user";
import { authentication, random } from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({ message: "Missing User Information" });
    }
    const user = await getUserByEmail(email).select(
      "+authentication.salt + authentication.password"
    );
    if (!user) {
      return res.status(400).json({ message: `Invalid User email: ${email}` });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ message: "Password incorrect" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("alex-app", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Missing User Information" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser != null) {
      return res.status(400).json({ message: "Existing User" });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
};
