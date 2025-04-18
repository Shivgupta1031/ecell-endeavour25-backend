import e from "express";
import { EventModel } from "../models/event.model";
import { TeamModel } from "../models/team.model";
import { TeamMemberModel } from "../models/members.model";
export class EventService {
  async createEvent(eventData: any) {
    const event = new EventModel(eventData);
    return await event.save();
  }

  async updateEvent(slug: string, eventData: any) {
    return await EventModel.findOneAndUpdate({ slug }, eventData, {
      new: true,
    });
  }

  async deleteEvent(slug: string) {
    return await EventModel.findOneAndDelete({ slug });
  }

  async flagDeleteEvent(slug: string) {
    return await EventModel.findOneAndUpdate({ slug }, { isDeleted: true }, { new: true });
  }
  async verifyPayment(teamCode: string, isVerified: boolean) {
    return await TeamModel.findOneAndUpdate(
      { teamCode },
      { isVerified },
      { new: true }
    );
  }
  async getAllEvents() {
    return await EventModel.find();
  }

  async getEventBySlug(slug: string) {
    return await EventModel.findOne({ slug });
  }

  async checkMemberResgistered(userId: string, eventSlug: string) {
    const teamAsLeader = await TeamModel.findOne({
      eventSlug,
      leaderId: userId
    });

    if (teamAsLeader) return true;

    const teamAsMember = await TeamModel.findOne({
      eventSlug,
      members: {
        $in: await TeamMemberModel.find({ userId }).distinct('_id')
      }
    });

    return !!teamAsMember;
  }
}
