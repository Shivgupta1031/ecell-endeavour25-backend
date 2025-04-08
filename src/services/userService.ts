import { UserModel } from "../models/user.model";
import { generateToken } from "../services/jwtService";
import { hashPassword, comparePassword } from "../utils/bcryptUtil";
import { UserPayload } from "../types";
import { OTPModel } from "../models/otp.model"; // New import
import { generateOTP } from "../utils/otpUtil"; // New import
import { sendEmail } from "../utils/emailService"; // New import
// import { console } from "inspector";
import mongoose from "mongoose";
import { generateUniqueSlug } from "../utils/generateSlug";

export class UserService {
  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    rollNo: string;
    college: string;
    libId: string;
    age: number;
    gender: string;
  }) {
    const {
      name,
      email,
      phone,
      password,
      rollNo,
      libId,
      college,
      age,
      gender,
    } = userData;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);
    const user = new UserModel({
      name,
      email,
      phone,
      rollNo,
      college,
      age,
      gender,
      libId,
      password: hashedPassword,
      isVerified: false, // Added isVerified field
    });

    await user.save();
    // Generate and store OTP
    const otp = generateOTP();
    const newOTP = new OTPModel({
      user: user._id,
      email,
      otp,
      type: "VERIFICATION",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
    await newOTP.save();

    // Send OTP email
    await this.sendVerificationEmail(email, name, otp);
    return user;
  }

  async flagKit(userData: { userId: string }) {
    const { userId } = userData;

    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (existingUser.kitTaken) {
      throw new Error("Kit already given");
    }

    existingUser.kitTaken = true;
    await existingUser.save();
  }

  async verifyOTP(email: string, otp: string) {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Find OTP record
    const otpRecord = await OTPModel.findOne({
      user: user._id,
      email,
      otp,
      type: "VERIFICATION",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      throw new Error("Invalid or expired OTP");
    }

    // Mark user as verified
    user.isVerified = true;
    await user.save();

    // Delete the OTP record
    await OTPModel.deleteOne({ _id: otpRecord._id });

    const userPayload: Partial<UserPayload> = {
      id: user.id,
      email: user.email,
      name: user.name,
      slug: user.slug ?? undefined,
    };

    return generateToken(userPayload);
  }

  async resendOTP(email: string): Promise<void> {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Delete existing OTP if any
    await OTPModel.deleteOne({ user: user._id, email, type: "VERIFICATION" });

    // Generate and store new OTP
    const otp = generateOTP();
    const newOTP = new OTPModel({
      user: user._id,
      email,
      otp,
      type: "VERIFICATION",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
    await newOTP.save();

    // Send OTP email
    await this.sendVerificationEmail(email, user.name, otp);
  }

  async forgotPassword(email: string): Promise<void> {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("No account found with this email");
    }

    // Delete existing password reset OTP if any
    await OTPModel.deleteOne({ user: user._id, email, type: "PASSWORD_RESET" });

    // Generate and store new OTP
    const otp = generateOTP();
    const newOTP = new OTPModel({
      user: user._id,
      email,
      otp,
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    });
    await newOTP.save();

    // Send password reset email
    await this.sendPasswordResetEmail(email, user.name, otp);
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<void> {
    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Find OTP record
    const otpRecord = await OTPModel.findOne({
      user: user._id,
      email,
      otp,
      type: "PASSWORD_RESET",
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      throw new Error("Invalid or expired OTP");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete the OTP record
    await OTPModel.deleteOne({ _id: otpRecord._id });
  }

  async loginUser(email: string, password: string) {
    const user = await UserModel.findOne({ email });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw new Error("Account not verified. Please verify your email first.");
    }

    const userPayload: Partial<UserPayload> = {
      id: user.id,
      email: user.email,
      name: user.name,
      rollNo: user.rollNo,
      college: user.college,
      libId: user.libId,
      gender: user.gender,
      age: user.age,
      profilePicture: user.profilePicture,
      slug: user.slug ?? undefined,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
    };

    const data = {
      token: generateToken(userPayload),
      userPayload: userPayload,
    };

    return data;
  }

  async fetchAllUsers() {
    return await UserModel.find();
  }

  async updateUser(userId: string, updateData: any) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID format");
    }

    // Fetch the user first to check if they exist
    let user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // If name is being updated, generate a new slug
    if (updateData.name && updateData.name !== user.name) {
      updateData.slug = await generateUniqueSlug(updateData.name);
    }

    // Perform the update
    user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return user;
  }

  // Helper methods for sending emails
  private async sendVerificationEmail(
    email: string,
    name: string,
    otp: string
  ): Promise<void> {
    const subject = "Verify Your Email - OTP";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #007827; text-align: center;">Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 8px; padding: 10px; background-color: #f5f5f5; border-radius: 5px; display: inline-block;">${otp}</div>
        </div>
        <p>This OTP is valid for 15 minutes. If you did not request this verification, please ignore this email.</p>
        <p>Best regards,<br>Your Application Team</p>
      </div>
    `;

    await sendEmail(email, subject, html);
  }

  private async sendPasswordResetEmail(
    email: string,
    name: string,
    otp: string
  ): Promise<void> {
    const subject = "Password Reset - OTP";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #007827; text-align: center;">Password Reset</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Please use the following OTP to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 8px; padding: 10px; background-color: #f5f5f5; border-radius: 5px; display: inline-block;">${otp}</div>
        </div>
        <p>This OTP is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,<br>Your Application Team</p>
      </div>
    `;

    await sendEmail(email, subject, html);
  }
}
