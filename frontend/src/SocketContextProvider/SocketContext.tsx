import React, { createContext, useContext, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SocketContext = createContext<any>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000", {
        auth: { token: `${localStorage.getItem("token")}` },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 8000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected.");
      });
    }

    return () => {
      // Do not disconnect on unmount, keep the connection alive
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};
