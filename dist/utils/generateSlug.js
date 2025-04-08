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
exports.generateUniqueSlug = generateUniqueSlug;
const user_model_1 = require("../models/user.model");
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
};
function generateUniqueSlug(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let slug = generateSlug(name);
        let counter = 0;
        let uniqueSlug = slug;
        // Keep checking until we find a unique slug
        while (yield user_model_1.UserModel.findOne({ slug: uniqueSlug })) {
            counter++;
            uniqueSlug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }
        return uniqueSlug;
    });
}
