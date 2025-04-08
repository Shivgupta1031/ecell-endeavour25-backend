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
exports.UsernameController = void 0;
const user_model_1 = require("../models/user.model");
const responseHandler_1 = require("../utils/responseHandler");
const StatusCodes_1 = require("../constants/StatusCodes");
class UsernameController {
    /**
     * Checks if a username is already taken in the system
     * @param req Request object containing username in the body as "name"
     * @param res Response object
     */
    searchUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name || name.trim() === '') {
                    return (0, responseHandler_1.sendError)(res, "Username is required", StatusCodes_1.STATUS_CODES.BAD_REQUEST);
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
                const existingUser = yield user_model_1.UserModel.findOne({ name: name });
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
            }
            catch (error) {
                console.error("Error in searchUsername:", error);
                return (0, responseHandler_1.sendError)(res, "Server error while checking username", StatusCodes_1.STATUS_CODES.INTERNAL_SERVER, error);
            }
        });
    }
}
exports.UsernameController = UsernameController;
