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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("../models/user.model");
const jwtService_1 = require("../services/jwtService");
const bcryptUtil_1 = require("../utils/bcryptUtil");
class UserService {
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, password } = userData;
            const existingUser = yield user_model_1.UserModel.findOne({ email });
            if (existingUser) {
                throw new Error("Email already exists");
            }
            const hashedPassword = yield (0, bcryptUtil_1.hashPassword)(password);
            const user = new user_model_1.UserModel({ name, email, phone, password: hashedPassword });
            yield user.save();
            return user;
        });
    }
    verifyOTP(phone, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield user_model_1.UserModel.findOne({ phone });
            if (!user || user.otp !== otp || user.otpExpiresAt < new Date()) {
                throw new Error("Invalid or expired OTP");
            }
            user.otp = "";
            user.otpExpiresAt = new Date(0);
            yield user.save();
            const userPayload = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.isAdmin ? "ADMIN" : "USER",
                slug: (_a = user.slug) !== null && _a !== void 0 ? _a : undefined,
            };
            return (0, jwtService_1.generateToken)(userPayload);
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const user = yield user_model_1.UserModel.findOne({ email });
            if (!user || !(yield (0, bcryptUtil_1.comparePassword)(password, user.password))) {
                throw new Error("Invalid credentials");
            }
            const userPayload = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.isAdmin ? "ADMIN" : "USER",
                slug: (_a = user.slug) !== null && _a !== void 0 ? _a : undefined,
            };
            return (0, jwtService_1.generateToken)(userPayload);
        });
    }
    fetchAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.UserModel.find();
        });
    }
    updateUser(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.UserModel.findByIdAndUpdate(userId, updateData, { new: true });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    }
}
exports.UserService = UserService;
