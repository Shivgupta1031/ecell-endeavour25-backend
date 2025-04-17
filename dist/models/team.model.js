"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModel = void 0;
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    eventId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
    },
    eventSlug: {
        type: String,
        required: true,
    },
    leaderId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
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
});
exports.TeamModel = (0, mongoose_1.model)("Team", teamSchema);
