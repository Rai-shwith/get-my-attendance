const { logger } = require("./logger");

let io;

const initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server);

  io.on("connection", (socket) => {
    logger.debug("A client connected:", socket.id);

    socket.on("disconnect", () => {
      logger.debug("A client disconnected:", socket.id);
    });
  });
};

const sendMessage = (event, data) => {
  if (!io) {
    logger.error("Socket.IO not initialized! Call initSocket() first.");
    return;
  }
  logger.debug("From IO"+event+data)
  // Emit the event to all connected clients
  io.emit(event, data);
};

module.exports = { initSocket, sendMessage };
