"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
const mongoose_1 = require("mongoose");
const nanoid_1 = require("nanoid");
const eventSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        unique: true,
        default: () => (0, nanoid_1.nanoid)(8),
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
    minTeamSize: {
        type: Number,
        required: true,
        min: [1, "Minimum team size must be at least 1"],
    },
    maxTeamSize: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
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
            validator: function (value) {
                return value > this.registrationStartDate;
            },
            message: "Registration end date must be after the start date",
        },
    },
    eventDate: {
        type: Date,
        default: null,
        validate: {
            validator: function (value) {
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
    prize: {
        type: Number,
        required: true,
        min: [0, "Prize amount cannot be negative"],
    },
    teams: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
}, { timestamps: true } // Adds createdAt and updatedAt fields
);
exports.EventModel = (0, mongoose_1.model)("Event", eventSchema);
