import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";

const EditProfile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useLocalStorage("currentUser", null);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    skills: [],
    location: "",
    profileImageUrl: ""
  });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Initialize form with current user data
    if (currentUser.profile) {
      setFormData({
        fullName: currentUser.profile.fullName || "",
        bio: currentUser.profile.bio || "",
        skills: currentUser.profile.skills || [],
        location: currentUser.profile.location || "",
        profileImageUrl: currentUser.profile.profileImageUrl || ""
      });
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // In a real app, you would make an API call here
      // For now, we'll just update the local storage
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...currentUser,
        profile: {
          ...formData
        }
      };
      
      setCurrentUser(updatedUser);
      setMessage({ 
        type: "success", 
        text: "Profile updated successfully!" 
      });
      
      // Redirect to profile page after successful update
      setTimeout(() => {
        navigate(`/profile/${currentUser.username}`);
      }, 1500);
      
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "Failed to update profile. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-md ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="skills">
              Skills
            </label>
            <div className="flex">
              <input
                type="text"
                id="skills"
                value={skillInput}
                onChange={handleSkillInputChange}
                className="flex-1 p-3 border border-gray-300 rounded-l-md"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="City, Country"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="profileImageUrl">
              Profile Image URL
            </label>
            <input
              type="url"
              id="profileImageUrl"
              name="profileImageUrl"
              value={formData.profileImageUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
            
            {formData.profileImageUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img 
                  src={formData.profileImageUrl} 
                  alt="Profile preview" 
                  className="w-20 h-20 object-cover rounded-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Error";
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/profile/${currentUser.username}`)}
              className="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
