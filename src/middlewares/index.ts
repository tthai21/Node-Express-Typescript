import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/user";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["alex-app"];
    if (!sessionToken) {
      return res.status(403).json({ message: "Missing session token" });
    }
    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({ message: "User not found" });
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    return res.status(404).json({ message: error.message || error });
  }
};
