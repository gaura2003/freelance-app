const ProjectCard = ({ title, description, budget, category }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{description}</p>
        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>{category}</span>
          <span className="font-bold text-green-600 dark:text-green-400">${budget}</span>
        </div>
      </div>
    );
  };
  
  export default ProjectCard;
  