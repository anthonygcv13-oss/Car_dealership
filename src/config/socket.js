let ioInstance = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: {
      origin: '*', // En producción se puede restringir según orígenes específicos
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  ioInstance.on('connection', (socket) => {
    console.log(`🔌 Cliente WebSocket conectado al servidor: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log(`❌ Cliente WebSocket desconectado: ${socket.id}`);
    });
  });

  return ioInstance;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io no ha sido inicializado. Llama a initSocket(server) primero.");
  }
  return ioInstance;
};

module.exports = { initSocket, getIO };
