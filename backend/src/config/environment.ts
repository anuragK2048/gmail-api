import dotenv from "dotenv";
import { z } from "zod"; // Using Zod for validation

// Load .env file only in non-production environments or if explicitly told to
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Define a schema for environment variables using Zod
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(5000), // Coerce to number, default if not set
  SESSION_SECRET: z
    .string()
    .min(32, "Session secret must be at least 32 characters long"),
  REDIS_URL: z.string().url().optional(), // Optional if MemoryStore is fallback
  FRONTEND_URL: z.string().url("Frontend URL must be a valid URL"),
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  GOOGLE_CALLBACK_URI: z
    .string()
    .url("Google Callback URI must be a valid URL"),
  DATABASE_URL: z.string().url().optional(), // For Supabase/PostgreSQL connection string if used directly
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  // Add other critical environment variables here
});

// Validate environment variables
let validatedEnv;
try {
  validatedEnv = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "🔥 Invalid environment variables:",
      error.flatten().fieldErrors // Shows errors per field
    );
  } else {
    console.error("🔥 Invalid environment variables:", error);
  }
  process.exit(1); // Exit if validation fails
}

export const {
  NODE_ENV,
  PORT,
  SESSION_SECRET,
  REDIS_URL,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URI,
  DATABASE_URL,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
} = validatedEnv;

export const CORS_ORIGINS =
  NODE_ENV === "production"
    ? [FRONTEND_URL, "https://mailmind.com"]
    : [FRONTEND_URL, "http://localhost:5173"];
