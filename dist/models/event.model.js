"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = void 0;
const mongoose_1 = require("mongoose");
const generateSlug_1 = require("../utils/generateSlug");
const eventSchema = new mongoose_1.Schema({
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
    isDeleted: {
        type: Boolean,
        default: false,
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
    prize: [
        {
            position: { type: String, required: true },
            amount: { type: Number, required: true },
        },
    ],
    teams: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Team",
        },
    ],
}, { timestamps: true } // Adds createdAt and updatedAt fields
);
eventSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew || this.isModified("name")) {
            try {
                this.slug = yield (0, generateSlug_1.generateUniqueSlug)(this.name);
            }
            catch (error) {
                return next(error);
            }
        }
        next();
    });
});
exports.EventModel = (0, mongoose_1.model)("Event", eventSchema);
