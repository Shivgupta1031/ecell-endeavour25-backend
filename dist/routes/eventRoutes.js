"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("../controllers/eventController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const router = express_1.default.Router();
const eventController = new eventController_1.EventController();
router.post("/events", authMiddleware_1.authenticate, adminMiddleware_1.isAdmin, eventController.createEvent.bind(eventController));
router.put("/events/:slug", authMiddleware_1.authenticate, adminMiddleware_1.isAdmin, eventController.updateEvent.bind(eventController));
router.delete("/events/:slug", authMiddleware_1.authenticate, adminMiddleware_1.isAdmin, eventController.deleteEvent.bind(eventController));
router.get("/events", eventController.getAllEvents.bind(eventController));
router.get("/events/:slug", eventController.getEventBySlug.bind(eventController));
exports.default = router;
