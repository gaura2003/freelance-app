// src/pages/CategoriesPage.jsx
import { useEffect, useState } from "react";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "https://your-production-url.com/api";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiBase}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("API not available, loading dummy categories...");
        }
      } catch (error) {
        console.error(error);

        // Dummy fallback
        setCategories([
          { _id: "1", name: "Web Development" },
          { _id: "2", name: "Graphic Design" },
          { _id: "3", name: "Content Writing" },
          { _id: "4", name: "Marketing" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <div className="text-center p-10">Loading categories...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Categories</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <li key={category._id} className="bg-white dark:bg-blue-900 p-4 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">{category.name}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
