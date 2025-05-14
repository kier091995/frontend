import { io } from 'socket.io-client';

let socket;

export const useSocket = () => {
  const connect = () => {
    if (!socket) {
      socket = io(import.meta.env.VITE_API_BASE_URL, {
        transports: ['websocket'],
      });
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  const onTaskUpdated = (callback) => {
    if (socket) {
      socket.on('task-updated', callback);
    }
  };

  const emitTaskUpdated = (task) => {
    if (socket) {
      socket.emit('task-updated', task);
    }
  };

  return {
    connect,
    disconnect,
    onTaskUpdated,
    emitTaskUpdated,
  };
};
