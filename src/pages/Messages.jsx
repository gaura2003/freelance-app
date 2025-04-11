import { useState, useEffect, useRef } from "react";
import { Send, Search, Phone, Video, MoreVertical, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { messages as dummyMessages } from "../data/messages";
import { users as dummyUsers } from "../data/users";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState("list"); // "list" or "chat"
  
  const messagesEndRef = useRef(null);
  
  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`${apiBase}/messages/conversations`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        } else {
          throw new Error("Failed to fetch conversations");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        
        // DUMMY fallback data
        const currentUserId = "u1"; // Assuming current user is John Doe
        
        // Create conversations from dummy messages
        const conversationMap = new Map();
        
        dummyMessages.forEach(msg => {
          const otherUserId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
          
          if (!conversationMap.has(otherUserId)) {
            const otherUser = dummyUsers.find(user => user._id === otherUserId);
            
            if (otherUser) {
              conversationMap.set(otherUserId, {
                _id: `conv_${otherUserId}`,
                otherUser: {
                  _id: otherUser._id,
                  username: otherUser.username,
                  fullName: otherUser.profile.fullName,
                  profileImageUrl: otherUser.profile.profileImageUrl || "https://i.pravatar.cc/150?img=2"
                },
                lastMessage: {
                  content: msg.content,
                  timestamp: msg.timestamp,
                  senderId: msg.senderId
                },
                unreadCount: Math.floor(Math.random() * 3) // Random unread count for demo
              });
            }
          }
        });
        
        // Add more dummy conversations
        const dummyConversations = [
          {
            _id: "conv_u3",
            otherUser: {
              _id: "u3",
              username: "mike_wilson",
              fullName: "Mike Wilson",
              profileImageUrl: "https://i.pravatar.cc/150?img=3"
            },
            lastMessage: {
              content: "I've reviewed your proposal and would like to discuss further.",
              timestamp: "2023-10-14T15:30:00Z",
              senderId: "u3"
            },
            unreadCount: 2
          },
          {
            _id: "conv_u4",
            otherUser: {
              _id: "u4",
              username: "sarah_johnson",
              fullName: "Sarah Johnson",
              profileImageUrl: "https://i.pravatar.cc/150?img=4"
            },
            lastMessage: {
              content: "The project is coming along nicely! Can't wait to see the final result.",
              timestamp: "2023-10-13T09:15:00Z",
              senderId: "u1"
            },
            unreadCount: 0
          },
          {
            _id: "conv_u5",
            otherUser: {
              _id: "u5",
              username: "alex_brown",
              fullName: "Alex Brown",
              profileImageUrl: "https://i.pravatar.cc/150?img=5"
            },
            lastMessage: {
              content: "Thanks for your help with the website. It looks great!",
              timestamp: "2023-10-12T14:45:00Z",
              senderId: "u5"
            },
            unreadCount: 0
          }
        ];
        
        // Combine and sort by timestamp
        const allConversations = [...conversationMap.values(), ...dummyConversations]
          .sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));
        
        setConversations(allConversations);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;
    
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${apiBase}/messages/conversation/${selectedConversation._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          throw new Error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        
        // DUMMY fallback data
        const currentUserId = "u1"; // Assuming current user is John Doe
        const otherUserId = selectedConversation.otherUser._id;
        
        // Filter messages for this conversation
        const conversationMessages = dummyMessages.filter(
          msg => (msg.senderId === currentUserId && msg.receiverId === otherUserId) || 
                 (msg.senderId === otherUserId && msg.receiverId === currentUserId)
        );
        
        // Add more dummy messages
        const additionalMessages = [
          {
            _id: "m3",
            senderId: currentUserId,
            receiverId: otherUserId,
            content: "I've been working on similar projects for the past 3 years.",
            timestamp: "2023-10-10T10:10:00Z"
          },
          {
            _id: "m4",
            senderId: otherUserId,
            receiverId: currentUserId,
            content: "That's great! What's your availability like for the next few weeks?",
            timestamp: "2023-10-10T10:15:00Z"
          },
          {
            _id: "m5",
            senderId: currentUserId,
            receiverId: otherUserId,
            content: "I can start right away and dedicate about 20 hours per week to your project.",
            timestamp: "2023-10-10T10:20:00Z"
          },
          {
            _id: "m6",
            senderId: otherUserId,
            receiverId: currentUserId,
            content: "Perfect! Let's schedule a call to discuss the details.",
            timestamp: "2023-10-10T10:25:00Z"
          }
        ];
        
        // Combine and sort by timestamp
        const allMessages = [...conversationMessages, ...additionalMessages]
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        setMessages(allMessages);
      }
    };

    fetchMessages();
    
    // Mark conversation as read
    if (selectedConversation.unreadCount > 0) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv._id === selectedConversation._id ? { ...conv, unreadCount: 0 } : conv
        )
      );
    }
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Format date
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    const messageData = {
      receiverId: selectedConversation.otherUser._id,
      content: newMessage.trim()
    };
    
    // Optimistically add message to UI
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      senderId: "u1", // Assuming current user is John Doe
      receiverId: selectedConversation.otherUser._id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      pending: true
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");
    
    try {
      const response = await fetch(`${apiBase}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('freelancehub_token')}`
        },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Replace temp message with actual message
        setMessages(prev => 
          prev.map(msg => msg._id === tempId ? data : msg)
        );
        
        // Update conversation list
        setConversations(prev => {
          const updatedConversations = prev.map(conv => 
            conv._id === selectedConversation._id 
              ? {
                  ...conv,
                  lastMessage: {
                    content: newMessage.trim(),
                    timestamp: new Date().toISOString(),
                    senderId: "u1" // Assuming current user is John Doe
                  }
                }
              : conv
          );
          
          // Sort by latest message
          return updatedConversations.sort(
            (a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
          );
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      // For demo purposes, just remove the pending state
      setMessages(prev => 
        prev.map(msg => msg._id === tempId ? { ...msg, pending: false } : msg)
      );
      
      // Update conversation list anyway for demo
      setConversations(prev => {
        const updatedConversations = prev.map(conv => 
          conv._id === selectedConversation._id 
            ? {
                ...conv,
                lastMessage: {
                  content: newMessage.trim(),
                  timestamp: new Date().toISOString(),
                  senderId: "u1" // Assuming current user is John Doe
                }
              }
            : conv
        );
        
        // Sort by latest message
        return updatedConversations.sort(
          (a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
        );
      });
    }
  };

  // Filter conversations by search term
  const filteredConversations = conversations.filter(conv => 
    conv.otherUser.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-blue-600 text-lg animate-pulse">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-[calc(100vh-180px)]">
        <div className="flex h-full">
          {/* Conversation List */}
          <div className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 ${mobileView === 'chat' ? 'hidden md:block' : 'block'}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
              <div className="mt-2 relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No conversations found
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    onClick={() => {
                      setSelectedConversation(conversation);
                      setMobileView("chat");
                    }}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      selectedConversation?._id === conversation._id ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <img
                        src={conversation.otherUser.profileImageUrl}
                        alt={conversation.otherUser.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {conversation.otherUser.fullName}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatMessageDate(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conversation.lastMessage.senderId === "u1" ? "You: " : ""}
                            {conversation.lastMessage.content}
                          </p>
                          
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className={`w-full md:w-2/3 flex flex-col ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                  <button 
                    onClick={() => setMobileView("list")}
                    className="md:hidden mr-2 text-gray-600 dark:text-gray-400"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <img
                    src={selectedConversation.otherUser.profileImageUrl}
                    alt={selectedConversation.otherUser.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedConversation.otherUser.fullName}
                    </h3>
                    <Link 
                      to={`/profile/${selectedConversation.otherUser.username}`}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isCurrentUser = message.senderId === "u1"; // Assuming current user is John Doe
                    
                    return (
                      <div 
                        key={message._id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[75%] rounded-lg px-4 py-2 ${
                            isCurrentUser 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          } ${message.pending ? 'opacity-70' : ''}`}
                        >
                          <p>{message.content}</p>
                          <div 
                            className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'
                            }`}
                          >
                            {formatMessageDate(message.timestamp)}
                            {message.pending && " • Sending..."}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <form onSubmit={sendMessage} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  Your Messages
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                  Select a conversation from the list to start chatting, or start a new conversation with a freelancer or client.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

