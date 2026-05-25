require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const http       = require("http");
const path       = require("path");
const fs         = require("fs");
const { Server } = require("socket.io");

const connectDB  = require("./config/db");
const Team       = require("./models/Team");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { saveMessage } = require("./controllers/messageController");

// Connect to Database Instantly
connectDB();

const app    = express();
const server = http.createServer(app);

// ─────────────────────────────────────────────────────────────
// 🌐 CORS SYSTEM LAYERS (Synced with Local & Deployment Domains)
// ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "https://student-project-management-one.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────
// 📂 DIRECTORY SYSTEM SAFEGUARDS & STATIC ENGINE
// ─────────────────────────────────────────────────────────────
const requiredDirs = [
  path.join(__dirname, "uploads"),
  path.join(__dirname, "uploads/avatars"),
  path.join(__dirname, "uploads/submissions"),
];

requiredDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─────────────────────────────────────────────────────────────
// 🔌 SOCKET.IO ENGINE (Real-Time Communication Pipeline)
// ─────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`⚡ Client connected to server tunnel: ${socket.id}`);

  // User notifications registration pipeline
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User registered in private notification pipeline: ${userId}`);
  });

  // Team space tunnel binding
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`👥 Client bound securely to room node: ${roomId}`);
  });

  // Direct Team Chat Process Sync
  socket.on("send-message", async (msg) => {
    try {
      if (!msg?.roomId || !msg?.text) return;

      const team = await Team.findById(msg.roomId);
      if (team) {
        // Asynchronously save message context directly to MongoDB via Controller
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
      console.error("❌ Socket engine failed to process text stream transmission:", err.message);
    }
  });

  // Typing Interceptor Broadcast Engine
  socket.on("typing", (data) => {
    if (data?.roomId) {
      socket.to(data.roomId).emit("user-typing", data);
    }
  });

  // Real-time Push Alert Core Distribution Node
  socket.on("send-notification", (data) => {
    if (data?.recipientId) {
      io.to(data.recipientId).emit("receive-notification", data);
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client logged off server stream safely: ${socket.id}`);
  });
});

// Attach socket reference safely to global Express configuration stack
app.set("io", io);
global.io = io;

// ─────────────────────────────────────────────────────────────
// 🛣️ REST API ENDPOINT ROUTING PIPELINES
// ─────────────────────────────────────────────────────────────
app.use("/api/auth",          require("./routes/authRoutes"));
app.use("/api/projects",      require("./routes/projectRoutes"));
app.use("/api/teams",         require("./routes/teamRoutes"));
app.use("/api/faculty",       require("./routes/facultyRoutes")); // 🧠 Fix: Replaced old crashed mentor route path map
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/profile",       require("./routes/profileRoutes"));
app.use("/api/subjects",      require("./routes/subjectRoutes"));
app.use("/api/submissions",   require("./routes/submissionRoutes"));
app.use("/api/tasks",         require("./routes/taskRoutes"));
app.use("/api/messages",      require("./routes/messageRoutes"));
app.use("/api/stats",         require("./routes/statsRoutes"));
app.use("/api/admin",         require("./routes/adminRoutes"));

// Live status reporting entry endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    message: "SPMS API production environment is fully active.",
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

// Native Health Endpoint Integration Monitor
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, status: "healthy", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────────────────────────
// ⚠️ FALLBACK GLOBAL ERROR MANAGEMENT BOUNDARIES
// ─────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Production deployment cluster running securely on port: ${PORT}`);
});