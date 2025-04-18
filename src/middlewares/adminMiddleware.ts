// adminMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !(req.user.isAdmin || req.user.isSuperAdmin)) {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};
