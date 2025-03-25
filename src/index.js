import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import webhookRoutes from "./app/routes/webhookRoutes.js";
import messageRoutes from "./app/routes/messageRoutes.js";
import { createAdapter } from '@socket.io/redis-adapter';
import redis from "./config/redisClient.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: "/listener", // Đổi path theo FE
  cors: {
    origin: "*", // Dùng cho demo; production cần giới hạn origin
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true
  },
  allowEIO3: true // fix loi polling 400 bad request mot so client cu.
});
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// share instance io for orther route
app.set("io", io);
// handle
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("joinRoom", (serverName) => {
    socket.join(serverName);
    console.log(`Socket ${socket.id} joined room ${serverName}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// redis adapter
io.adapter(createAdapter(redis, redis.duplicate()));

// Mount routes
app.use("/webhook", webhookRoutes(io));
app.use("/messages", messageRoutes);

// liveness prob
app.get("/health", (req, res) => res.status(200).send("OK"));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Server đang chạy trên port ${port}`);
});
