// src/utils/uploadMessage.js
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

const uploadMessage = async (messageData) => {
  try {
    const { text, senderId, receiverId } = messageData;

    // Thêm tin nhắn vào Firestore
    const docRef = await addDoc(collection(db, "messages"), {
      text,
      senderId,
      receiverId,
      timestamp: new Date(),
    });

    console.log("Message sent with ID: ", docRef.id);
    return docRef.id; // Trả về ID của tin nhắn
  } catch (error) {
    console.error("Error sending message: ", error);
    throw new Error("Failed to send message");
  }
};

export default uploadMessage;
