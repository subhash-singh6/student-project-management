const express    = require("express");
const dotenv     = require("dotenv");
const cors       = require("cors");
const http       = require("http");
const { Server } = require("socket.io");
const connectDB  = require("./config/db");
const { saveMessage, isTeamMember } = require("./controllers/messageController");
const Team = require("./models/Team");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:  process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/projects",      require("./routes/projectRoutes"));
app.use("/api/teams",         require("./routes/teamRoutes"));
app.use("/api/mentor",        require("./routes/mentorRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/profile",       require("./routes/profileRoutes"));
app.use("/api/subjects",      require("./routes/subjectRoutes"));
app.use("/api/submissions",   require("./routes/submissionRoutes"));
app.use("/api/tasks",         require("./routes/taskRoutes"));
app.use("/api/messages",      require("./routes/messageRoutes"));
app.use("/api/stats",         require("./routes/statsRoutes"));
app.use("/api/admin",         require("./routes/adminRoutes"));

app.get("/", (req, res) => {
  res.json({
    message: "SPMS API is Running",
    version: "3.0.0",
    docs: {
      auth: "/api/auth",
      projects: "/api/projects",
      teams: "/api/teams",
      submissions: "/api/submissions",
      tasks: "/api/tasks",
      messages: "/api/messages",
      stats: "/api/stats",
      admin: "/api/admin",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined notification room`);
  });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("send-message", async (msg) => {
    try {
      if (!msg?.roomId || !msg?.text) return;

      const team = await Team.findById(msg.roomId);
      if (team) {
        const saved = await saveMessage({
          teamId: team._id,
          senderId: msg.senderId,
          senderName: msg.senderName,
          text: msg.text,
          roomId: msg.roomId,
        });

        const payload = {
          id: saved._id,
          text: saved.text,
          senderId: msg.senderId,
          senderName: msg.senderName,
          time: saved.createdAt,
          roomId: msg.roomId,
        };

        io.to(msg.roomId).emit("receive-message", payload);
        return;
      }

      socket.to(msg.roomId).emit("receive-message", msg);
    } catch (err) {
      console.error("send-message error:", err.message);
    }
  });

  socket.on("typing", (data) => {
    if (data?.roomId) {
      socket.to(data.roomId).emit("user-typing", data);
    }
  });

  socket.on("send-notification", (data) => {
    if (data?.recipientId) {
      io.to(data.recipientId).emit("receive-notification", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

app.set("io", io);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
