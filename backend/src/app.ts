import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import helmet from "helmet"; //for security header
import morgan from "morgan"; //HTTP request logger
import { NODE_ENV, SESSION_SECRET, FRONTEND_URL } from "./config";
import { redisStore } from "./config";
import apiRoutes from "./api/routes";
// import { globalErrorHandler } from "./middleware/errorHandler";
// import { NotFoundError } from "./utils/errors"; // A custom error class
import { nextTick } from "process";

const app: Application = express();

//Core middleware
const corsOptions = {
  origin: FRONTEND_URL || true,
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10kb" })); // Adjust limit as needed
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// HTTP request logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Session - Middleware
app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "lax", // Consider 'strict' if appropriate
    },
  })
);

// typescript
declare module "express-session" {
  interface SessionData {
    userId?: string;
    isLoggedIn?: boolean;
  }
}

//API Routes
app.get("/", (req: Request, res: any) => res.send("API Healthy"));
app.use("/api/v1", apiRoutes);

// --- 404 Handler for API routes ---
// app.all("/api/*", (req: Request, res: Response, next: NextFunction) => {
//   next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
// });

//Global Error Handler Middleware
// app.use(globalErrorHandler);

export default app;
