// Importing necessary functions from the specified modules
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";

// Importing context providers
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

// Importing the 'db' object from the Firebase configuration file
import { db } from "../firebase";

// Defining a functional component named 'Chats'
const Chats = () => {
  // State variable 'chats' and a function to update it
  const [chats, setChats] = useState([]);

  // Accessing current user and dispatch function from AuthContext and ChatContext
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  // Effect hook for fetching user chats when component mounts or currentUser changes
  useEffect(() => {
    // Function to get user chats
    const getChats = () => {
      // Subscribing to changes in the user's chats collection
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        // Updating 'chats' state with the retrieved data
        setChats(doc.data());
      });

      // Returning a cleanup function to unsubscribe when component unmounts or currentUser changes
      return () => {
        unsub();
      };
    };

    // Checking if currentUser.uid exists and then calling 'getChats' function
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  // Function to handle user selection
  const handleSelect = (u) => {
    // Dispatching an action to change the selected user in the chat context
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  // JSX markup for rendering the component
  return (
    <div className="chats">
      {/* Mapping through the 'chats' object and sorting it based on date */}
      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
        // Rendering individual chat items
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleSelect(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Exporting the 'Chats' component as the default export
export default Chats;
