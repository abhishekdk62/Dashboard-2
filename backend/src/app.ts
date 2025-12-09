import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
import sequelize from "./models";
import routes from "./routes";
import { initSockets } from "./sockets/ticket.sockets";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

initSockets(server);

(async () => {
  try {
    await sequelize.sync({ force: true });

    const bcrypt = require("bcryptjs");

    const UserModel = sequelize.models.User as any;
    if (UserModel) {
      await UserModel.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: bcrypt.hashSync("admin123", 12),
        role: "admin",
      });
    }

    console.log("Database synced & admin created");
  } catch (error) {
    console.error(" DB sync failed:", error);
  }
})();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

export default app;
