import { Schema, model } from "mongoose";
import { generateUniqueSlug } from "../utils/generateSlug";

const userSchema = new Schema({
  slug: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  rollNo: {
    type: String,
    required: false,
  },
  college: {
    type: String,
    required: false,
  },
  libId: {
    type: String,
    required: false,
    },
  gender: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: false,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: "",
  },
  entertainment_eve_booked: {
    type: Boolean,
    default: false,
  },
  kitTaken: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    try {
      this.slug = await generateUniqueSlug(this.name);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const UserModel = model("User", userSchema);