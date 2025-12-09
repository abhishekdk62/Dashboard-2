import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import dotenv from 'dotenv';
import sequelize from './models';
import routes from './routes';
import { initSockets } from './sockets/ticket.sockets';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

// Socket.io
initSockets(server);

// DB Sync & Seed Admin
(async () => {
  try {
    await sequelize.sync({ force: true }); // Set false in production
    
    // Seed admin user
    const bcrypt = require('bcryptjs');
    await sequelize.models.User.create({
      name: 'Admin',
      email: 'admin@support.com',
      password: bcrypt.hashSync('admin123', 12),
      role: 'admin',
    });

    console.log('✅ Database synced & admin created');
  } catch (error) {
    console.error('❌ DB sync failed:', error);
  }
})();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
