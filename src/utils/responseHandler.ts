import { Response } from "express";
import { STATUS_CODES } from "../constants/StatusCodes";

interface SuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: any;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = STATUS_CODES.SUCCESS
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    ...(data && { data }),
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = STATUS_CODES.INTERNAL_SERVER,
  error?: any
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(error && { error }),
  };
  res.status(statusCode).json(response);
};
