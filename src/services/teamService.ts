import { UserModel } from "../models/user.model";
import { EventModel } from "../models/event.model";
import { TeamModel } from "../models/team.model";
import { TeamMemberModel } from "../models/members.model";

export class TeamService {

  async fetchUserRegisteredEvents(userId: string) {
    const leaderTeams = await TeamModel.find({ leaderId: userId, isRegisterd: true })
      .populate('eventId', 'name description startDate endDate venue image')
      .lean();

    const memberEntries = await TeamMemberModel.find({ userId, role: "MEMBER" });

    const teamIds = memberEntries.map(entry => entry.teamId);

    const memberTeams = await TeamModel.find({
      _id: { $in: teamIds },
      isRegisterd: true
    })
      .populate('eventId', 'name description startDate endDate venue image')
      .lean();

    const allTeams = [...leaderTeams, ...memberTeams];

    return allTeams;
  }

  async fetchUserRegisteredEventsData(userId: string) {
    const allTeams = await TeamModel.find({
      $or: [
        { leaderId: userId, isRegisterd: true },
        { _id: { $in: (await TeamMemberModel.find({ userId, role: "MEMBER" }).lean()).map(entry => entry.teamId) }, isRegisterd: true }
      ]
    })
      .populate({
        path: 'eventId', 
        select: 'name description registrationStartDate registrationEndDate eventDate fees poster qrcode slug', 
      })
      .populate({
        path: 'members',
        select: 'userId',
        populate: {
          path: 'userId', 
          select: 'name email phone college gender slug profilePicture',
        }
      })
      .lean();
  
    return allTeams;
  }

  async getTeamById(teamId: string) {
    return await TeamModel.findById(teamId)
      .populate('eventId', 'name description startDate endDate venue image')
      .lean();
  }

  async addTeam(TeamData: {
    eventSlug: string;
    leaderId: string;
    teamName: string;
    isVerified: boolean;
    paymentTransactionId: string;
    paymentScreenshot: string;
  }) {
    const { eventSlug, leaderId, teamName, isVerified, paymentTransactionId, paymentScreenshot } = TeamData;

    const existingEvent = await EventModel.findOne({ slug: eventSlug });
    if (!existingEvent) {
      throw new Error("Event not exists");
    }

    const teamCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const existingTeam = await TeamModel.findOne({ eventSlug, teamName });
    if (existingTeam) {
      throw new Error("Team name already exists for this event");
    }


    const team = new TeamModel({
      eventId: existingEvent.id,
      eventSlug,
      leaderId,
      teamName,
      isVerified,
      isRegisterd: true,
      teamCode,
      paymentTransactionId,
      paymentScreenshot,
    });

    const existingMember = await TeamMemberModel.findOne({
      id: leaderId,
      teamId: team.id,
    });

    if (existingMember) {
      throw new Error("User already exists in this team");
    }

    const member = new TeamMemberModel({
      teamId: team.id,
      teamName: team.teamName,
      userId: leaderId,
      role: "LEADER",
      teamCode,
    });

    await member.save();

    existingEvent.teams.push(team.id);
    team.members.push(member.id);

    await existingEvent.save();

    await team.save();
    return team;
  }

  async joinTeam(TeamData: { userId: string; teamCode: string }) {
    const { teamCode, userId } = TeamData;

    const existingTeam = await TeamModel.findOne({ teamCode });
    if (!existingTeam) {
      throw new Error("Team not exists");
    }

    const existingUser = await UserModel.findOne({ _id: userId });

    if (!existingUser) {
      throw new Error("User not exists");
    }

    const findEvent = await EventModel.findOne({ _id: existingTeam.eventId });

    if (!findEvent || existingTeam.members.length > findEvent.maxTeamSize) {
      throw new Error("Event not exists or team size is full");
    }

    const existingMember = await TeamMemberModel.findOne({
      userId,
      teamCode,
    });

    if (existingMember) {
      throw new Error("User already exists in this team");
    }

    const member = new TeamMemberModel({
      teamId: existingTeam.id,
      teamCode,
      teamName: existingTeam.teamName,
      userId,
      role: "MEMBER",
    });

    await member.save();

    existingTeam.members.push(member.id);

    await existingTeam.save();

    // Return both member and team data to allow frontend to update properly
    return {
      member,
      team: existingTeam,
    };
  }

  async fetchAllMembers() {
    return await TeamMemberModel.find();
  }

  async fetchTeamsbyEventId(eventId: string) {
    return await TeamModel.find({ eventId })
      .populate("eventId", "name description startDate endDate venue image")
      .lean();
  }

  async fetchMembersbyTeamId(teamId: string) {
    return await TeamMemberModel.find({ teamId });
  }
  
  async getAllTeams() {
    const teams = await TeamModel.find({})
      .populate({
        path: "eventId",
        select: "name startDate endDate venue image slug"
      })
      .populate({
        path: 'members',
        select: 'userId',
        populate: {
          path: 'userId', 
          select: 'name email phone college gender slug profilePicture',
        }
      })
      .lean();
  
    return teams;
  }
}
