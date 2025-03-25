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

  useEffect(() => {
    const messagesRef = collection(db, "meetings", "meetingId", "messages"); // Reference to the meeting's messages collection
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Ignore empty messages

    try {
      const messagesRef = collection(db, "meetings", "meetingId", "messages");
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
    <div className="flex flex-col h-full w-full bg-[#1e2a34] p-4 rounded-2xl">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("p-2", message.userId === user?.id ? "bg-[#2d3748] self-end" : "bg-[#2c2f33]")}>
            <strong>{message.userName}: </strong> {message.text}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow bg-[#2d3748] text-white p-2 rounded-xl mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;