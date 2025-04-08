"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMemberModel = void 0;
const mongoose_1 = require("mongoose");
const teamMemberSchema = new mongoose_1.Schema({
    teamId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    teamName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        enum: ["LEADER", "MEMBER"],
        required: true,
    },
    teamCode: {
        type: String,
        required: true,
    }
});
teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });
exports.TeamMemberModel = (0, mongoose_1.model)("TeamMember", teamMemberSchema);
