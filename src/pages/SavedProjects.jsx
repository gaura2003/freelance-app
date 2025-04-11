import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { useLocalStorage } from "../hooks/useLocalStorage";

const SavedProjects = () => {
  const [savedProjects, setSavedProjects] = useLocalStorage("savedProjects", []);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch saved projects
    const fetchSavedProjects = () => {
      // Filter projects that are in the savedProjects array
      const filtered = projects.filter(project => 
        savedProjects.includes(project._id)
      );
      setDisplayProjects(filtered);
      setLoading(false);
    };

    fetchSavedProjects();
  }, [savedProjects]);

  const removeFromSaved = (projectId) => {
    const updatedSavedProjects = savedProjects.filter(id => id !== projectId);
    setSavedProjects(updatedSavedProjects);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Saved Projects</h1>
        <p className="text-center py-8">Loading saved projects...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Projects</h1>
      
      {displayProjects.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <p className="text-lg mb-4">You haven't saved any projects yet.</p>
          <Link 
            to="/find-projects" 
            className="inline-block py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {displayProjects.map(project => (
            <div key={project._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      <Link to={`/projects/${project._id}`} className="hover:text-blue-600 transition">
                        {project.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                  </div>
                  <button 
                    onClick={() => removeFromSaved(project._id)}
                    className="text-gray-500 hover:text-red-500 transition"
                    title="Remove from saved"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {project.category}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    ${project.budget}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Status: <span className="font-medium capitalize">{project.status}</span>
                  </span>
                  <Link 
                    to={`/projects/${project._id}`}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProjects;
