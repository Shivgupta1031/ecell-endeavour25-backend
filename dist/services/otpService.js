"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = exports.generateOTP = void 0;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
const sendOTP = (phone, otp) => {
    // Integrate with any SMS service provider (e.g., Twilio)
    console.log(`Sending OTP ${otp} to phone number ${phone}`);
};
exports.sendOTP = sendOTP;
