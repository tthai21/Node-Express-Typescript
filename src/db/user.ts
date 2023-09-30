import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  authentication: {
    password: {
      type: String,
      require: true,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUser = () => {
  const users = UserModel.find();
  return users;
};
export const getUserByEmail = (email: string) => {
  const user = UserModel.findOne({ email });
  return user;
};
export const getUserBySessionToken = (sessionToken: string) => {
  const user = UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
  return user;
};
export const getUserById = (id: string) => {
  const user = UserModel.findById(id);
  return user;
};
export const createUser = (value: Record<string, any>) => {
  const user = new UserModel(value).save().then((user) => user.toObject());
  return user;
};
export const deleteUserById = (id: string) => {
  const user = UserModel.findOneAndDelete({ _id: id });
  return user;
};
export const updateUserById = (id: string, value: Record<string, any>) => {
  const user = UserModel.findByIdAndUpdate(id, value);
  return user;
};
