import { useEffect, useState } from "react";
import { db } from "@/lib/firebase"; // Import your firebase config
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { useUser } from "@clerk/nextjs"; // Clerk's useUser hook to get the current user's ID
import { cn } from "@/lib/utils";


type Message = {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: any; // Firestore timestamp
};

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const pathname=window.location.pathname;
  console.log(pathname);
  const meetingId=pathname.split("/")[2];



  useEffect(() => {
    if (!meetingId || typeof meetingId!=="string") return ; // Ensure meetingId is available
    const messagesRef = collection(db, "meetings", meetingId, "messages"); // Reference to the meeting's messages collection
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [meetingId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Ignore empty messages

    try {
      if(!meetingId || typeof meetingId!=="string") return;
      const messagesRef = collection(db, "meetings", meetingId , "messages");
      await addDoc(messagesRef, {
        userId: user?.id,
        userName: user?.username || "Anonymous",
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1c2633] p-4 rounded-3xl shadow-2xl border border-[#2c3e50]">
  <div className="flex-grow overflow-y-auto mb-4 space-y-2 scrollbar-thin scrollbar-track-[#1e2a34] scrollbar-thumb-[#2c3e50] pr-2">
    {messages.map((message) => (
      <div 
        key={message.id} 
        className={cn(
          "p-3 rounded-lg max-w-[80%] break-words",
          message.userId === user?.id 
            ? "bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-white self-end ml-auto" 
            : "bg-gradient-to-br from-[#2c3e50] to-[#34495e] text-gray-200"
        )}
      >
        <div className="flex items-center mb-1">
          <span className="font-semibold text-sm text-blue-300 mr-2">
            {message.userName}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(message.timestamp?.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
        <p className="text-sm">{message.text}</p>
      </div>
    ))}
  </div>
  <div className="flex items-center space-x-2">
    <input
      type="text"
      className="flex-grow bg-[#2d3748] text-white p-3 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all duration-300 border border-[#3a4f66]"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type your message..."
      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
    />
    <button
      onClick={sendMessage}
      className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors duration-300 flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
</div>
  );
};

export default ChatComponent;