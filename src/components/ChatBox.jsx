const ChatBox = ({ user, lastMessage, time }) => {
    return (
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition">
        <div className="flex items-center">
          <img src={user.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <h5 className="font-semibold text-gray-800 dark:text-white">{user.name}</h5>
            <p className="text-xs text-gray-500 dark:text-gray-400">{lastMessage}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
    );
  };
  
  export default ChatBox;
  