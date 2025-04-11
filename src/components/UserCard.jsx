const UserCard = ({ name, role, avatar }) => {
    return (
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 hover:shadow-lg transition">
        <img
          src={avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h4 className="font-semibold text-gray-800 dark:text-white">{name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    );
  };
  
  export default UserCard;
  