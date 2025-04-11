const CategoryFilter = ({ categories, selected, onSelect }) => {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`px-4 py-2 rounded-full border ${
              selected === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
            } hover:shadow transition`}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  };
  
  export default CategoryFilter;
  