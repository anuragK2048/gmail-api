import { Request, Response, NextFunction } from "express";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session && req.session.userId && req.session.isLoggedIn)
    return next();
  else res.status(401).json({ message: "Unauthorized." });
};
