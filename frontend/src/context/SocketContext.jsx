import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthContext } from "../context/AuthContext";

const SocketContext = createContext(null);

export const useSocketContext = () => {
	const socket = useContext(SocketContext);
	return socket;
};

export const SocketContextProvider = ({ children }) => {
	const { authUser } = useAuthContext();
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);

	useEffect(() => {
		if (authUser) {
			// Dynamic server URL based on where your frontend runs
			const serverURL =
				import.meta.env.MODE === "development"
					? "http://localhost:5000"
					: "https://chat-app-yt.onrender.com";

			const newSocket = io(serverURL, {
				withCredentials: true,  // important for cookies & auth
				query: { userId: authUser._id },
			});

			setSocket(newSocket);

			newSocket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => newSocket.close();
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
