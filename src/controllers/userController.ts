import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { sendSuccess, sendError } from "../utils/responseHandler";
import { STATUS_CODES } from "../constants/StatusCodes";
import { MESSAGES } from "../constants/messages";
import { UserModel } from "../models/user.model";
import { TeamModel } from "../models/team.model";
import { EventModel } from "../models/event.model";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }
  async getUserProfile(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      const user = await UserModel.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      return res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: {
          user
        }
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
  async registerUser(req: Request, res: Response) {
    try {
      await this.userService.registerUser(req.body);
      sendSuccess(res, MESSAGES.REGISTER_SUCCESS, null, STATUS_CODES.CREATED);
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }

  async verifyOTP(req: Request, res: Response) {
    try {
      const token = await this.userService.verifyOTP(
        req.body.email,
        req.body.otp
      );
      sendSuccess(res, MESSAGES.OTP_VERIFY_SUCCESS, { token });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }
  async resendOTP(req: Request, res: Response) {
    try {
      await this.userService.resendOTP(req.body.email);
      sendSuccess(res, MESSAGES.OTP_RESENT_SUCCESS);
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }
  async forgotPassword(req: Request, res: Response) {
    try {
      await this.userService.forgotPassword(req.body.email);
      sendSuccess(res, MESSAGES.FORGOT_PASSWORD_SUCCESS);
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }
  async resetPassword(req: Request, res: Response) {
    try {
      await this.userService.resetPassword(
        req.body.email,
        req.body.otp,
        req.body.newPassword
      );
      sendSuccess(res, MESSAGES.PASSWORD_RESET_SUCCESS);
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }
  async flagKit(req: Request, res: Response) {
    try {
      const token = await this.userService.flagKit(
        req.body
      );
      sendSuccess(res, MESSAGES.KIT_FLAGGED);
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.UNAUTHORIZED,
        error
      );
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const token = await this.userService.loginUser(
        req.body.email,
        req.body.password
      );
      sendSuccess(res, MESSAGES.LOGIN_SUCCESS, { token });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.UNAUTHORIZED,
        error
      );
    }
  }

  async fetchAllUsers(_req: Request, res: Response) {
    try {
      const users = await this.userService.fetchAllUsers();
      sendSuccess(res, MESSAGES.FETCH_SUCCESS, { users });
    } catch (error: any) {
      sendError(
        res,
        MESSAGES.SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER,
        error
      );
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userService.updateUser(
        req.params.userId,
        req.body
      );
      sendSuccess(res, MESSAGES.UPDATE_SUCCESS, { user });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await this.userService.getUser(
        req.params.userId
      );
      sendSuccess(res, MESSAGES.UPDATE_SUCCESS, { user });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }

  async getDashboardData(req: Request, res: Response) {
    try {
      const [teamsByEvent, events, users] = await Promise.all([
        TeamModel.find()
          .populate({
            path: "eventId",
            select: "_id name slug poster fees"
          })
          .populate({
            path: "members.userId",
            select: "_id name slug email isVerified"
          })
          .lean(),

        EventModel.find()
          .select("_id name slug poster fees")
          .lean(),

        UserModel.find()
          .select("_id name slug email isVerified")
          .lean()
      ]);

      return res.status(200).json({
        success: true,
        message: "Dashboard Data Retrieved Successfully",
        data: {
          teamsByEvent,
          events,
          users
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
}
