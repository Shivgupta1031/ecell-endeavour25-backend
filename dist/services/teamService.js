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
exports.TeamService = void 0;
const user_model_1 = require("../models/user.model");
const event_model_1 = require("../models/event.model");
const team_model_1 = require("../models/team.model");
const members_model_1 = require("../models/members.model");
class TeamService {
    // Add this method to TeamService
    fetchUserRegisteredEvents(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find teams where user is the leader
            const leaderTeams = yield team_model_1.TeamModel.find({ leaderId: userId, isRegisterd: true })
                .populate('eventId', 'name description startDate endDate venue image')
                .lean();
            // Find team members where user is a member
            const memberEntries = yield members_model_1.TeamMemberModel.find({ userId, role: "MEMBER" });
            // Get team IDs where user is a member
            const teamIds = memberEntries.map(entry => entry.teamId);
            // Find those teams
            const memberTeams = yield team_model_1.TeamModel.find({
                _id: { $in: teamIds },
                isRegisterd: true
            })
                .populate('eventId', 'name description startDate endDate venue image')
                .lean();
            // Combine both results
            const allTeams = [...leaderTeams, ...memberTeams];
            return allTeams;
        });
    }
    getTeamById(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield team_model_1.TeamModel.findById(teamId)
                .populate('eventId', 'name description startDate endDate venue image')
                .lean();
        });
    }
    addTeam(TeamData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { eventId, eventSlug, leaderId, teamName, isVerified } = TeamData;
            const existingEvent = yield event_model_1.EventModel.findOne({ _id: eventId });
            if (!existingEvent) {
                throw new Error("Event not exists");
            }
            const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existingTeam = yield team_model_1.TeamModel.findOne({ eventId, teamName });
            if (existingTeam) {
                throw new Error("Team name already exists for this event");
            }
            const existingUser = yield user_model_1.UserModel.findOne({ _id: leaderId });
            if (!existingUser) {
                throw new Error("User not exists");
            }
            const team = new team_model_1.TeamModel({
                eventId,
                eventSlug,
                leaderId,
                teamName,
                isVerified,
                isRegisterd: true,
                teamCode,
            });
            const existingMember = yield members_model_1.TeamMemberModel.findOne({
                id: leaderId,
                teamId: team.id,
            });
            if (existingMember) {
                throw new Error("User already exists in this team");
            }
            const member = new members_model_1.TeamMemberModel({
                teamId: team.id,
                teamName: team.teamName,
                userId: leaderId,
                role: "LEADER",
                teamCode,
            });
            yield member.save();
            existingEvent.teams.push(team.id);
            team.members.push(member.id);
            yield existingEvent.save();
            yield team.save();
            return team;
        });
    }
    joinTeam(TeamData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { teamCode, userId } = TeamData;
            const existingTeam = yield team_model_1.TeamModel.findOne({ teamCode });
            if (!existingTeam) {
                throw new Error("Team not exists");
            }
            const existingUser = yield user_model_1.UserModel.findOne({ _id: userId });
            if (!existingUser) {
                throw new Error("User not exists");
            }
            const findEvent = yield event_model_1.EventModel.findOne({ _id: existingTeam.eventId });
            if (!findEvent || existingTeam.members.length > findEvent.maxTeamSize) {
                throw new Error("Event not exists or team size is full");
            }
            const existingMember = yield members_model_1.TeamMemberModel.findOne({
                userId,
                teamCode,
            });
            if (existingMember) {
                throw new Error("User already exists in this team");
            }
            const member = new members_model_1.TeamMemberModel({
                teamId: existingTeam.id,
                teamCode,
                teamName: existingTeam.teamName,
                userId,
                role: "MEMBER",
            });
            yield member.save();
            existingTeam.members.push(member.id);
            yield existingTeam.save();
            // Return both member and team data to allow frontend to update properly
            return {
                member,
                team: existingTeam
            };
        });
    }
    fetchAllMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield members_model_1.TeamMemberModel.find();
        });
    }
    fetchTeamsbyEventId(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield team_model_1.TeamModel.find({ eventId })
                .populate('eventId', 'name description startDate endDate venue image')
                .lean();
        });
    }
    fetchMembersbyTeamId(teamId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield members_model_1.TeamMemberModel.find({ teamId });
        });
    }
}
exports.TeamService = TeamService;
