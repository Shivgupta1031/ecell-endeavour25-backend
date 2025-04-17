import express, { RequestHandler } from "express";
import { EventController } from "../controllers/eventController";
import { authenticate } from "../middlewares/authMiddleware";
import { isAdmin } from "../middlewares/adminMiddleware";

const router = express.Router();
const eventController = new EventController();

router.post(
  "/events",
  authenticate as RequestHandler,
  isAdmin as RequestHandler,
  eventController.createEvent.bind(eventController)
);

router.put(
  "/events/:slug",
  authenticate as RequestHandler,
  isAdmin as RequestHandler,
  eventController.updateEvent.bind(eventController)
);

router.delete(
  "/events/:slug",
  authenticate as RequestHandler,
  isAdmin as RequestHandler,
  eventController.deleteEvent.bind(eventController)
);

router.post(
  "/events/check-registration",
  eventController.checkMemberRegistered.bind(eventController)
);

router.get("/events", eventController.getAllEvents.bind(eventController));
router.get("/events/:slug", eventController.getEventBySlug.bind(eventController));

router.post("/events/flagdelete", eventController.flagDeleteEvent.bind(eventController));
router.patch(
  "/teams/verify/:teamCode",
  authenticate as RequestHandler,
  isAdmin as RequestHandler,
  eventController.verifyPayment.bind(eventController)
);
export default router;
