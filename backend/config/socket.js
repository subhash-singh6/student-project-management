const { Server } = require("socket.io");
const { saveMessage } = require("../controllers/messageController");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000", // Aapke frontend ka URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  // Active user connections tracking mapping layer (Optional keep-alive state)
  const activeUsers = new Map();

  io.on("connection", (socket) => {
    console.log(`⚡ User connected to socket pipe: ${socket.id}`);

    // 1. User Online System Integration (For live notifications mapping)
    socket.on("setup_user", (userId) => {
      socket.join(userId); // Har individual user ko uski userId ke room me daal dete hain
      activeUsers.set(userId, socket.id);
      console.log(`👤 User registered in private notification room: ${userId}`);
    });

    // 2. Chat Room Join System (Team Specific Pipeline)
    socket.on("join_team_chat", (teamId) => {
      socket.join(teamId); // Student apni team ke individual room me space secure karega
      console.log(`👥 Socket ${socket.id} joined team chat tunnel: ${teamId}`);
    });

    // 3. Instant Messages Pipeline Layer
    socket.on("send_message", async (messageData) => {
      const { teamId, senderId, senderName, text } = messageData;

      try {
        // Core controller method to write data into MongoDB asynchronously
        const savedMsg = await saveMessage({
          teamId,
          senderId,
          senderName,
          text,
          roomId: teamId
        });

        // Room me baithe baaki saare team members ko live message transmit karo
        io.to(teamId).emit("receive_message", {
          _id: savedMsg._id,
          team: teamId,
          sender: {
            _id: senderId,
            name: senderName
          },
          text,
          createdAt: savedMsg.createdAt
        });
        
      } catch (error) {
        console.error("❌ Socket message processing crash:", error.message);
        socket.emit("message_error", { message: "Failed to securely broadcast message." });
      }
    });

    // 4. Real-time Task Board Syncing (Kanban drag and drop movement updates)
    socket.on("task_moved", (taskData) => {
      // taskData contains { teamId, taskId, sourceColumn, destinationColumn }
      if (taskData.teamId) {
        socket.to(taskData.teamId).emit("task_updated_live", taskData);
      }
    });

    // 5. Connection Drop/Cleanup Layer
    socket.on("disconnect", () => {
      // Remove connection from mapping registry on socket disconnection
      for (let [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          console.log(`🚫 User ${userId} logged off from live stream.`);
          break;
        }
      }
      console.log(`🔌 Client disconnected from pipe: ${socket.id}`);
    });
  });

  // Global helper function object register taaki normal controllers se notification live trigger ho sake
  global.io = io;

  return io;
};

module.exports = { initSocket };