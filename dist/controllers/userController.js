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
exports.UserController = void 0;
const userService_1 = require("../services/userService");
const responseHandler_1 = require("../utils/responseHandler");
const StatusCodes_1 = require("../constants/StatusCodes");
const messages_1 = require("../constants/messages");
class UserController {
    constructor() {
        this.userService = new userService_1.UserService();
    }
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.registerUser(req.body);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.REGISTER_SUCCESS, null, StatusCodes_1.STATUS_CODES.CREATED);
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.BAD_REQUEST, error);
            }
        });
    }
    verifyOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.userService.verifyOTP(req.body.phone, req.body.otp);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.OTP_VERIFY_SUCCESS, { token });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.BAD_REQUEST, error);
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.userService.loginUser(req.body.email, req.body.password);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.LOGIN_SUCCESS, { token });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.UNAUTHORIZED, error);
            }
        });
    }
    fetchAllUsers(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.fetchAllUsers();
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.FETCH_SUCCESS, { users });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.INTERNAL_SERVER, error);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.updateUser(req.params.userId, req.body);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.UPDATE_SUCCESS, { user });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.BAD_REQUEST, error);
            }
        });
    }
}
exports.UserController = UserController;
