import { Document, Schema, model } from "mongoose";
import { Models } from "../../common/dbModels";
import { UserI } from "../../interfaces/user.interface";
import jwt from "jsonwebtoken";
import { NextFunction } from "express";
import bcrypt from "bcryptjs";
const userSchema = new Schema<UserI & Document>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.generateToken = function () {
  const token = jwt.sign(
    { userId: this._id },
    process.env.JWT_EXPIRE_TOKEN as jwt.Secret
  );
  return token;
};
const User = model(Models.USER, userSchema);
export default User;
