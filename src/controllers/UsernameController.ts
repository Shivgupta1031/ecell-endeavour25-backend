import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { sendSuccess, sendError } from "../utils/responseHandler";
import { STATUS_CODES } from "../constants/StatusCodes";

export class UsernameController {
  /**
   * Checks if a username is already taken in the system
   * @param req Request object containing username in the body as "name"
   * @param res Response object
   */
  async searchUsername(req: Request, res: Response) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return sendError(
          res,
          "Username is required",
          STATUS_CODES.BAD_REQUEST
        );
      }
      
      // Check if username length meets minimum requirements
      if (name.length < 3) {
        return res.status(200).json({
          msg: "Taken",
          success: false,
          message: "Username must be at least 3 characters long"
        });
      }
      
      // Find if the username already exists
      const existingUser = await UserModel.findOne({ name: name });
      
      if (existingUser) {
        return res.status(200).json({
          msg: "Taken",
          success: false,
          message: "This username is already taken"
        });
      }
      
      // If username is available
      return res.status(200).json({
        msg: "Not Taken",
        success: true,
        message: "Username is available"
      });
      
    } catch (error: any) {
      console.error("Error in searchUsername:", error);
      
      return sendError(
        res,
        "Server error while checking username",
        STATUS_CODES.INTERNAL_SERVER,
        error
      );
    }
  }
}