"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    if (!req.user || (!req.user.isAdmin && !req.user.isSuperAdmin)) {
        return res.status(403).json({ message: "Access Denied" });
    }
    next();
};
exports.isAdmin = isAdmin;
