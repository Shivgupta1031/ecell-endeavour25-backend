// services/eventService.ts
import { EventModel } from "../models/event.model";

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

  async getAllEvents() {
    return await EventModel.find();
  }

  async getEventBySlug(slug: string) {
    return await EventModel.findOne({ slug });
  }
}
