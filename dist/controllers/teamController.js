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
exports.TeamController = void 0;
const responseHandler_1 = require("../utils/responseHandler");
const StatusCodes_1 = require("../constants/StatusCodes");
const messages_1 = require("../constants/messages");
const teamService_1 = require("../services/teamService");
class TeamController {
    constructor() {
        this.teamService = new teamService_1.TeamService();
    }
    // Add this method to TeamController
    getTeamById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teamId = req.params.id;
                if (!teamId) {
                    return (0, responseHandler_1.sendError)(res, "Team ID is required", StatusCodes_1.STATUS_CODES.BAD_REQUEST);
                }
                const team = yield this.teamService.getTeamById(teamId);
                if (!team) {
                    return (0, responseHandler_1.sendError)(res, "Team not found", StatusCodes_1.STATUS_CODES.NOT_FOUND);
                }
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.TEAM_FETCH, { team });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.INTERNAL_SERVER, error);
            }
        });
    }
    getUserRegisteredEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.query;
                console.log(req.query);
                if (!userId) {
                    return (0, responseHandler_1.sendError)(res, "User ID is required", StatusCodes_1.STATUS_CODES.BAD_REQUEST);
                }
                const teams = yield this.teamService.fetchUserRegisteredEvents(userId);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.EVENTS_FETCH, { teams: teams || [] });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.INTERNAL_SERVER, error);
            }
        });
    }
    addTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const team = yield this.teamService.addTeam(req.body);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.TEAM_ADDED, { team });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.BAD_REQUEST, error);
            }
        });
    }
    joinTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const team = yield this.teamService.joinTeam(req.body);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.TEAM_ADDED, { team });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.BAD_REQUEST, error);
            }
        });
    }
    getTeamsByEventId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.body;
                const teams = yield this.teamService.fetchTeamsbyEventId(eventId);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.TEAM_FETCH, { teams });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.INTERNAL_SERVER, error);
            }
        });
    }
    getMembersByTeamId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { teamId } = req.body;
                const members = yield this.teamService.fetchMembersbyTeamId(teamId);
                (0, responseHandler_1.sendSuccess)(res, messages_1.MESSAGES.MEMBER_FETCH, { members });
            }
            catch (error) {
                (0, responseHandler_1.sendError)(res, error.message || messages_1.MESSAGES.SERVER_ERROR, StatusCodes_1.STATUS_CODES.INTERNAL_SERVER, error);
            }
        });
    }
}
exports.TeamController = TeamController;
