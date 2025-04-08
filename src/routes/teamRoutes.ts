import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { TeamController } from "../controllers/teamController";

const router = express.Router();
const teamController = new TeamController();


router.post("/addTeam", (req, res) => teamController.addTeam(req, res));

router.post("/joinTeam", (req, res) => teamController.joinTeam(req, res));

router.post("/event/teams", (req, res) =>
  teamController.getTeamsByEventId(req, res)
);

router.post("/team/members",  (req, res) =>
  teamController.getMembersByTeamId(req, res)
);

router.get("/teams/:id", authenticate, (req, res) =>
  teamController.getTeamById(req, res)
);

router.get("/user/teams", authenticate, (req, res) =>
  teamController.getUserRegisteredEvents(req, res)
);

export default router;
