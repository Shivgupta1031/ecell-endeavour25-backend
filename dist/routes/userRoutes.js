"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const teamController_1 = require("../controllers/teamController");
const router = express_1.default.Router();
const userController = new userController_1.UserController();
const teamController = new teamController_1.TeamController();
router.post("/register", (req, res) => userController.registerUser(req, res));
router.post("/verify-otp", (req, res) => userController.verifyOTP(req, res));
// New routes for password reset functionality
router.post("/forgot-password", (req, res) => userController.forgotPassword(req, res));
router.post("/reset-password", (req, res) => userController.resetPassword(req, res));
// Route for resending OTP
router.post("/resend-otp", (req, res) => userController.resendOTP(req, res));
router.post("/login", (req, res) => userController.loginUser(req, res));
router.get("/users", authMiddleware_1.authenticate, (req, res) => userController.fetchAllUsers(req, res));
router.put("/users/:userId", authMiddleware_1.authenticate, (req, res) => userController.updateUser(req, res));
router.post("/users/flagKit", (req, res) => userController.flagKit(req, res));
// Add this to the router
router.get("/user/registered-events", (req, res) => teamController.getUserRegisteredEvents(req, res));
// User profile routes
router.get("/users/profile", authMiddleware_1.authenticate, (req, res) => {
    userController.getUserProfile(req, res);
});
exports.default = router;
