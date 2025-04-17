import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  user: mongoose.Types.ObjectId;
  email: string;
  otp: string;
  type: string; // "VERIFICATION" | "PASSWORD_RESET"
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["VERIFICATION", "PASSWORD_RESET"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index to automatically expire documents
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);