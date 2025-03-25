// handle on webhook routes & broadcast to Socket.IO
export const handleNewMessage = (io, message) => {
    const { type, payload } = message;
    if (type === "new_message") {
        if (payload.serverName) {
        io.to(payload.serverName).emit("new_message", payload);
        console.log(`Broadcast new_message to room ${payload.serverName}`);
        }
      else {
        io.emit("new_message", payload);
        console.log("Miss serverName, Broadcast new_message to all clients");
      }
    } else if (type === "new_conversation") {
        // Broadcast hội thoại mới
        if (payload.serverName) {
        io.to(payload.serverName).emit("new_conversation", payload);
        console.log(`Broadcast new_conversation to room ${payload.serverName}`);
        }
      else {
        io.emit("new_conversation", payload);
        console.log("Miss serverName, Broadcast new_conversation to all clients");
      }
    }
};
