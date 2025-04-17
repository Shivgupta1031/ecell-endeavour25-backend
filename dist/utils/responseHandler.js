"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const StatusCodes_1 = require("../constants/StatusCodes");
const sendSuccess = (res, message, data, statusCode = StatusCodes_1.STATUS_CODES.SUCCESS) => {
    const response = Object.assign({ success: true, message }, (data && { data }));
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = StatusCodes_1.STATUS_CODES.INTERNAL_SERVER, error) => {
    const response = Object.assign({ success: false, message }, (error && { error }));
    res.status(statusCode).json(response);
};
exports.sendError = sendError;
