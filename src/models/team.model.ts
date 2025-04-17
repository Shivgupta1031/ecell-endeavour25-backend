import { Schema, model } from "mongoose";

const teamSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  eventSlug: {
    type: String,
    required: true,
  },
  leaderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "TeamMember",
    },
  ],
  isRegisterd: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  teamCode:{
    type: String,
    required: true,
  },
  paymentTransactionId: {
    type: String,
    required: true,
  },
  paymentScreenshot: {
    type: String,
    required: true,
  }
});

export const TeamModel = model("Team", teamSchema);
