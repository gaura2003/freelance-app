import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const categoriesData = [
        { _id: "1", name: "Web Development", icon: "💻", count: 145, description: "Find experts in building websites and web applications." },
        { _id: "2", name: "Graphic Design", icon: "🎨", count: 98, description: "Connect with talented designers for logos, branding, and visual content." },
        { _id: "3", name: "Content Writing", icon: "✍️", count: 67, description: "Discover skilled writers for blogs, articles, and marketing copy." },
        { _id: "4", name: "Digital Marketing", icon: "📱", count: 52, description: "Find experts in SEO, social media, and online advertising." },
        { _id: "5", name: "Mobile App Development", icon: "📲", count: 89, description: "Connect with developers who build iOS and Android applications." },
        { _id: "6", name: "UI/UX Design", icon: "🖌️", count: 76, description: "Find designers who create intuitive and beautiful user experiences." },
        { _id: "7", name: "Video Production", icon: "🎬", count: 43, description: "Discover professionals for video editing, animation, and production." },
        { _id: "8", name: "Photography", icon: "📷", count: 38, description: "Connect with photographers for product, portrait, and event photography." },
        { _id: "9", name: "Data Analysis", icon: "📊", count: 56, description: "Find experts in data visualization, statistics, and insights." },
        { _id: "10", name: "Voice Over", icon: "🎙️", count: 29, description: "Discover voice talent for commercials, explainer videos, and more." },
        { _id: "11", name: "Translation", icon: "🌐", count: 34, description: "Connect with translators for documents, websites, and applications." },
        { _id: "12", name: "3D Modeling", icon: "🧊", count: 27, description: "Find professionals for 3D models, rendering, and animation." },
      ];
      
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Browse Categories</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Explore different categories to find the perfect freelancer for your project or discover opportunities in your field.
        </p>
        
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Link 
              key={category._id} 
              to={`/categories/${category._id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{category.count} projects</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No categories match your search.
          </p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Categories;

