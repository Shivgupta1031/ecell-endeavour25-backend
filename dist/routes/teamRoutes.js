"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const teamController_1 = require("../controllers/teamController");
const router = express_1.default.Router();
const teamController = new teamController_1.TeamController();
router.post("/addTeam", (req, res) => teamController.addTeam(req, res));
router.post("/joinTeam", (req, res) => teamController.joinTeam(req, res));
router.post("/event/teams", (req, res) => teamController.getTeamsByEventId(req, res));
router.post("/team/members", (req, res) => teamController.getMembersByTeamId(req, res));
router.get("/teams/:id", authMiddleware_1.authenticate, (req, res) => teamController.getTeamById(req, res));
router.get("/user/teams", authMiddleware_1.authenticate, (req, res) => teamController.getUserRegisteredEvents(req, res));
exports.default = router;
