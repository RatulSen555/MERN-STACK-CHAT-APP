import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();

	// Determine if the message is from the logged-in user
	const fromMe = message.senderId === authUser?._id; // Added optional chaining for safety

	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser?.profilePic : selectedConversation?.profilePic;

	// Define bubble styles based on sender
	const bubbleStyles = fromMe
		? "bg-blue-500 text-white" // Sent messages: Blue background, white text
		: "bg-gray-200 text-gray-800"; // Received messages: Light gray background, dark gray text
        // For a dark mode theme, you might use: "bg-gray-700 text-gray-200" for received

	const shakeClass = message.shouldShake ? "shake" : "";

	// Basic placeholder for missing profile pictures
	const renderAvatar = () => (
		<div className='chat-image avatar'>
			<div className='w-10 rounded-full'>
				{profilePic ? (
					<img alt='User avatar' src={profilePic} />
				) : (
					<div className="flex items-center justify-center w-full h-full rounded-full bg-gray-300 text-gray-600 text-xl font-semibold">
						{/* Display initials or a placeholder icon */}
						{fromMe
							? authUser?.fullName?.substring(0, 1) || "?" // Initial from authUser
							: selectedConversation?.fullName?.substring(0, 1) || "?" // Initial from conversation partner
						}
					</div>
				)}
			</div>
		</div>
	);

	return (
		<div className={`chat ${chatClassName}`}>
			{/* Render avatar */}
			{renderAvatar()}

			{/* Message Bubble */}
			<div
				className={`chat-bubble ${bubbleStyles} ${shakeClass} p-3 max-w-sm md:max-w-md break-words shadow-sm`} // Added padding, max-width, word break, subtle shadow
			>
				{message.message}
			</div>

			{/* Timestamp */}
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center mt-1'>
				{formattedTime}
			</div>
		</div>
	);
};
export default Message;
