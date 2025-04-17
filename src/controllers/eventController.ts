// controllers/eventController.ts
import { Request, Response } from "express";
import { EventService } from "../services/eventService";
import { sendSuccess, sendError } from "../utils/responseHandler";
import { STATUS_CODES } from "../constants/StatusCodes";
import { MESSAGES } from "../constants/messages";

const eventService = new EventService();

export class EventController {
  // Add this method to your EventController class
async verifyPayment(req: Request, res: Response) {
  try {
    const { teamCode } = req.params;
    const { isVerified } = req.body;
    
    const team = await eventService.verifyPayment(teamCode, isVerified);
    if (!team) {
      return sendError(res, MESSAGES.TEAM_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }
    
    sendSuccess(res, MESSAGES.PAYMENT_VERIFIED, { team });
  } catch (error) {
    sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
  }
}
  async createEvent(req: Request, res: Response) {
    try {
      const event = await eventService.createEvent(req.body);
      sendSuccess(res, MESSAGES.EVENT_CREATED, { event }, STATUS_CODES.CREATED);
    } catch (error) {
      sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const event = await eventService.updateEvent(slug, req.body);
      if (!event) {
        return sendError(res, MESSAGES.EVENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }
      sendSuccess(res, MESSAGES.EVENT_UPDATED, { event });
    } catch (error) {
      sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
    }
  }

  async checkMemberRegistered(req: Request, res: Response) {
    try {
      const { userId, eventSlug } = req.body;
      const isRegistered = await eventService.checkMemberResgistered(userId, eventSlug);
      sendSuccess(res, MESSAGES.EVENT_FETCH, { isRegistered });
    } catch (error) {
      sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const event = await eventService.deleteEvent(slug);
      if (!event) {
        return sendError(res, MESSAGES.EVENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }
      sendSuccess(res, MESSAGES.EVENT_DELETED);
    } catch (error) {
      sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
    }
  }

  async flagDeleteEvent(req: Request, res: Response) {
    try {
      const { slug } = req.body;
      const event = await eventService.flagDeleteEvent(slug);
      if (!event) {
        return sendError(res, MESSAGES.EVENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }
      sendSuccess(res, MESSAGES.EVENT_DELETED);
    } catch (error) {
      sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
    }
  }

  async getAllEvents(_req: Request, res: Response) {
    try {
      const events = await eventService.getAllEvents();
      sendSuccess(res, MESSAGES.EVENT_FETCH, { events });
    } catch (error) {
      sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
    }
  }

  async getEventBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const event = await eventService.getEventBySlug(slug);
      if (!event) {
        return sendError(res, MESSAGES.EVENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }
      sendSuccess(res, MESSAGES.EVENT_FETCH, { event });
    } catch (error) {
      sendError(res, MESSAGES.SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER, error);
    }
  }

}
