import express from "express";
import { UserController } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { TeamController } from "../controllers/teamController";


const router = express.Router();
const userController = new UserController();
const teamController = new TeamController();

router.post("/register", (req, res) => userController.registerUser(req, res));

router.post("/verify-otp", (req, res) => userController.verifyOTP(req, res));
// New routes for password reset functionality
router.post("/forgot-password", (req, res) => userController.forgotPassword(req, res));

router.post("/reset-password", (req, res) => userController.resetPassword(req, res));
// Route for resending OTP
router.post("/resend-otp", (req, res) => userController.resendOTP(req, res));

router.post("/login", (req, res) => userController.loginUser(req, res));

router.get("/users", authenticate, (req, res) =>
  userController.fetchAllUsers(req, res)
);

router.put("/users/:userId", authenticate, (req, res) =>
  userController.updateUser(req, res)
);

router.post("/users/flagKit", (req, res) =>
  userController.flagKit(req, res)
);
// Add this to the router
router.get("/user/registered-events", (req, res) =>
  teamController.getUserRegisteredEvents(req, res)
);
// User profile routes
router.get("/users/profile", authenticate, (req, res) => {
  userController.getUserProfile(req, res);
});

export default router;
