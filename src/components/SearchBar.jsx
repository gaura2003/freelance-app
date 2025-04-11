const SearchBar = ({ onSearch }) => {
    return (
      <div className="flex items-center w-full max-w-md mx-auto p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm">
        <input
          type="text"
          placeholder="Search projects, freelancers..."
          onChange={(e) => onSearch(e.target.value)}
          className="flex-grow px-4 py-2 bg-transparent focus:outline-none text-gray-700 dark:text-gray-200"
        />
      </div>
    );
  };
  
  export default SearchBar;
  