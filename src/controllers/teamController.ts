import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { sendSuccess, sendError } from "../utils/responseHandler";
import { STATUS_CODES } from "../constants/StatusCodes";
import { MESSAGES } from "../constants/messages";
import { TeamService } from "../services/teamService";

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }
  // Add this method to TeamController
  async getTeamById(req: Request, res: Response) {
    try {
      const teamId = req.params.id;

      if (!teamId) {
        return sendError(
          res,
          "Team ID is required",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const team = await this.teamService.getTeamById(teamId);
      if (!team) {
        return sendError(
          res,
          "Team not found",
          STATUS_CODES.NOT_FOUND
        );
      }

      sendSuccess(res, MESSAGES.TEAM_FETCH, { team });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER,
        error
      );
    }
  }

  async getUserRegisteredEvents(req: Request, res: Response) {
    try {
      const { userId } = req.body
      console.log(req.body);

      if (!userId) {
        return sendError(
          res,
          "User ID is required",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const teams = await this.teamService.fetchUserRegisteredEvents(userId as string);
      sendSuccess(res, MESSAGES.EVENTS_FETCH, { teams: teams || [] });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER,
        error
      );
    }
  }

  async getUserRegisteredEventsData(req: Request, res: Response) {
    try {
      const { userId } = req.body
      console.log(req.body);

      if (!userId) {
        return sendError(
          res,
          "User ID is required",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const teams = await this.teamService.fetchUserRegisteredEvents(userId as string);
      sendSuccess(res, MESSAGES.EVENTS_FETCH, { teams: teams || [] });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER,
        error
      );
    }
  }

  async addTeam(req: Request, res: Response) {
    try {
      const team = await this.teamService.addTeam(req.body);
      sendSuccess(res, MESSAGES.TEAM_ADDED, { team });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }

  async joinTeam(req: Request, res: Response) {
    try {
      const team = await this.teamService.joinTeam(req.body);
      sendSuccess(res, MESSAGES.TEAM_ADDED, { team });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.BAD_REQUEST,
        error
      );
    }
  }

  async getTeamsByEventId(req: Request, res: Response) {
    try {
      const { eventId } = req.body;
      const teams = await this.teamService.fetchTeamsbyEventId(eventId);
      sendSuccess(res, MESSAGES.TEAM_FETCH, { teams });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER,
        error
      );
    }
  }

  async getMembersByTeamId(req: Request, res: Response) {
    try {
      const { teamId } = req.body;
      const members = await this.teamService.fetchMembersbyTeamId(teamId);
      sendSuccess(res, MESSAGES.MEMBER_FETCH, { members });
    } catch (error: any) {
      sendError(
        res,
        error.message || MESSAGES.SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER,
        error
      );
    }
  }

}
