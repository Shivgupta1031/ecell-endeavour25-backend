import { Schema, model } from "mongoose";
import { generateUniqueSlug } from "../utils/generateSlug";

const eventSchema = new Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "No description provided.",
    },
    discount: {
      type: String,
    },
    minTeamSize: {
      type: Number,
      required: true,
      min: [1, "Minimum team size must be at least 1"],
    },
    isDeleted:{
      type: Boolean,
      default: false,
    },
    maxTeamSize: {
      type: Number,
      required: true,
      validate: {
        validator: function (this: any, value: number) {
          return value >= this.minTeamSize;
        },
        message: "Max team size must be greater than or equal to min team size",
      },
    },
    registrationStartDate: {
      type: Date,
      required: true,
    },
    registrationEndDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: any, value: Date) {
          return value > this.registrationStartDate;
        },
        message: "Registration end date must be after the start date",
      },
    },
    eventDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (this: any, value: Date) {
          return !value || value > this.registrationEndDate;
        },
        message: "Event date must be after registration end date",
      },
    },
    fees: {
      type: Number,
      required: true,
      min: [0, "Fees cannot be negative"],
    },
    // Added poster field
    poster: {
      type: String,
    },
    // Added QR code field
    qrcode: {
      type: String,
    },
    // Added FAQ field as an array of question-answer pairs
    faq: [
      {
        ques: { type: String, required: true },
        ans: { type: String, required: true }
      }
    ],
    prize: [
      {
        position: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

eventSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("name")) {
    try {
      this.slug = await generateUniqueSlug(this.name);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const EventModel = model("Event", eventSchema);