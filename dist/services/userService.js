"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const jwtService_1 = require("../services/jwtService");
const bcryptUtil_1 = require("../utils/bcryptUtil");
const otp_model_1 = require("../models/otp.model"); // New import
const otpUtil_1 = require("../utils/otpUtil"); // New import
const emailService_1 = require("../utils/emailService"); // New import
// import { console } from "inspector";
const mongoose_1 = __importDefault(require("mongoose"));
const generateSlug_1 = require("../utils/generateSlug");
class UserService {
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, password, rollNo, libId, college, age, gender, } = userData;
            const existingUser = yield user_model_1.UserModel.findOne({ email });
            if (existingUser) {
                throw new Error("Email already exists");
            }
            const hashedPassword = yield (0, bcryptUtil_1.hashPassword)(password);
            const user = new user_model_1.UserModel({
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
            yield user.save();
            // Generate and store OTP
            const otp = (0, otpUtil_1.generateOTP)();
            const newOTP = new otp_model_1.OTPModel({
                user: user._id,
                email,
                otp,
                type: "VERIFICATION",
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            });
            yield newOTP.save();
            // Send OTP email
            yield this.sendVerificationEmail(email, name, otp);
            return user;
        });
    }
    flagKit(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = userData;
            const existingUser = yield user_model_1.UserModel.findById(userId);
            if (!existingUser) {
                throw new Error("User not found");
            }
            if (existingUser.kitTaken) {
                throw new Error("Kit already given");
            }
            existingUser.kitTaken = true;
            yield existingUser.save();
        });
    }
    verifyOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Find user by email
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            // Find OTP record
            const otpRecord = yield otp_model_1.OTPModel.findOne({
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
            yield user.save();
            // Delete the OTP record
            yield otp_model_1.OTPModel.deleteOne({ _id: otpRecord._id });
            const userPayload = {
                id: user.id,
                email: user.email,
                name: user.name,
                slug: (_a = user.slug) !== null && _a !== void 0 ? _a : undefined,
            };
            return (0, jwtService_1.generateToken)(userPayload);
        });
    }
    resendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user by email
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            // Delete existing OTP if any
            yield otp_model_1.OTPModel.deleteOne({ user: user._id, email, type: "VERIFICATION" });
            // Generate and store new OTP
            const otp = (0, otpUtil_1.generateOTP)();
            const newOTP = new otp_model_1.OTPModel({
                user: user._id,
                email,
                otp,
                type: "VERIFICATION",
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            });
            yield newOTP.save();
            // Send OTP email
            yield this.sendVerificationEmail(email, user.name, otp);
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user by email
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error("No account found with this email");
            }
            // Delete existing password reset OTP if any
            yield otp_model_1.OTPModel.deleteOne({ user: user._id, email, type: "PASSWORD_RESET" });
            // Generate and store new OTP
            const otp = (0, otpUtil_1.generateOTP)();
            const newOTP = new otp_model_1.OTPModel({
                user: user._id,
                email,
                otp,
                type: "PASSWORD_RESET",
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            });
            yield newOTP.save();
            // Send password reset email
            yield this.sendPasswordResetEmail(email, user.name, otp);
        });
    }
    resetPassword(email, otp, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find user by email
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            // Find OTP record
            const otpRecord = yield otp_model_1.OTPModel.findOne({
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
            const hashedPassword = yield (0, bcryptUtil_1.hashPassword)(newPassword);
            // Update user password
            user.password = hashedPassword;
            yield user.save();
            // Delete the OTP record
            yield otp_model_1.OTPModel.deleteOne({ _id: otpRecord._id });
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user || !(yield (0, bcryptUtil_1.comparePassword)(password, user.password))) {
                throw new Error("Invalid credentials");
            }
            // Check if user is verified
            if (!user.isVerified) {
                throw new Error("Account not verified. Please verify your email first.");
            }
            const userPayload = {
                id: user.id,
                email: user.email,
                name: user.name,
                rollNo: user.rollNo,
                college: user.college,
                libId: user.libId,
                gender: user.gender,
                age: user.age,
                profilePicture: user.profilePicture,
                slug: (_a = user.slug) !== null && _a !== void 0 ? _a : undefined,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
            };
            const data = {
                token: (0, jwtService_1.generateToken)(userPayload),
                userPayload: userPayload,
            };
            return data;
        });
    }
    fetchAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.UserModel.find();
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
                throw new Error("Invalid user ID format");
            }
            // Fetch the user first to check if they exist
            let user = yield user_model_1.UserModel.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            // If name is being updated, generate a new slug
            if (updateData.name && updateData.name !== user.name) {
                updateData.slug = yield (0, generateSlug_1.generateUniqueSlug)(updateData.name);
            }
            // Perform the update
            user = yield user_model_1.UserModel.findOneAndUpdate({ _id: userId }, { $set: updateData }, { new: true, runValidators: true });
            return user;
        });
    }
    // Helper methods for sending emails
    sendVerificationEmail(email, name, otp) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield (0, emailService_1.sendEmail)(email, subject, html);
        });
    }
    sendPasswordResetEmail(email, name, otp) {
        return __awaiter(this, void 0, void 0, function* () {
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
            yield (0, emailService_1.sendEmail)(email, subject, html);
        });
    }
}
exports.UserService = UserService;
