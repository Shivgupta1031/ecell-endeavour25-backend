"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
/**
 * Generates a random 6-digit OTP code
 * @returns A string containing the 6-digit OTP
 */
const generateOTP = () => {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
};
exports.generateOTP = generateOTP;
