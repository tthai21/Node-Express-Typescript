import express from "express";
import { getUser, getUserByEmail, getUserById } from "../db/user";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUser();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ message: error.message || error });
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    existingUser.deleteOne();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: error.message || error });
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    user.username = req.body.username;
    user.email = req.body.email;
    await user.save();
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(404).json({ message: error.message || error });
  }
};
