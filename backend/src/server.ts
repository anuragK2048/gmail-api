import app from "./app";
import { PORT, NODE_ENV } from "./config";
import { connectToRedis } from "./config/redis";

const startServer = async () => {
  try {
    await connectToRedis();
    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
