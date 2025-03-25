import express from "express";
const router = express.Router();

// Giả lập watched trên MongoDB
const updateMessagesAsRead = async (conversationId, serverName) => {
  console.log(`Messages in conversation ${conversationId} marked as read on ${serverName} in MongoDB.`);
};

router.post("/read", async (req, res) => {
  const { conversationId, customerId, serverName } = req.body;
  if (!conversationId || !customerId || !serverName) {
    return res.status(400).json({ message: "conversationId || customerId || serverName are required." });
  }

  try {
    // Update watched MongoDB
    await updateMessagesAsRead(conversationId, serverName);

    // instance io from app To broadcast event
    const io = req.app.get("io");
    io.to(serverName).emit("messagesWatched", { conversationId });
    console.log(`Broadcasted messagesWatched for conversation ${conversationId} to room ${serverName}`);

    res.status(200).json({ message: "Messages marked as read and broadcasted." });
  } catch (error) {
    console.error("Error updating messages:", error);
    res.status(500).json({ message: "Error updating messages" });
  }
});

export default router;
