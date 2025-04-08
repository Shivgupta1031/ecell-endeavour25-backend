"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
const userController = new userController_1.UserController();
router.post("/register", (req, res) => userController.registerUser(req, res));
router.post("/verify-otp", (req, res) => userController.verifyOTP(req, res));
router.post("/login", (req, res) => userController.loginUser(req, res));
router.get("/users", authMiddleware_1.authenticate, (req, res) => userController.fetchAllUsers(req, res));
router.put("/users/:userId", authMiddleware_1.authenticate, (req, res) => userController.updateUser(req, res));
exports.default = router;
