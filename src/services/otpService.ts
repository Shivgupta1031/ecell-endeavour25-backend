import { v4 as uuidv4 } from "uuid";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = (phone: string, otp: string): void => {
  // Integrate with any SMS service provider (e.g., Twilio)
  console.log(`Sending OTP ${otp} to phone number ${phone}`);
};
