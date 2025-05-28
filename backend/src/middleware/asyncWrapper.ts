import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (req: Request, res: Response) => Promise<any>;

export const asyncWrapper =
  (fn: AsyncRequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res).catch((err) => console.log(err));
