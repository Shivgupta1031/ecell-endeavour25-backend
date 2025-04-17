import { Schema, model } from "mongoose";

interface TeamMember {
  id: string;
  teamId: string;
  teamName: string;
  userId: string;
  role: "LEADER" | "MEMBER";
  teamCode: string;
}

const teamMemberSchema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["LEADER", "MEMBER"],
    required: true,
  },
  teamCode:{
    type: String,
    required: true,
  }
});


teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true });

export const TeamMemberModel = model("TeamMember", teamMemberSchema);
