export const users = [
  {
    _id: "u1",
    username: "john_doe",
    profile: {
      fullName: "John Doe",
      bio: "Fullstack Developer",
      skills: ["React", "Node.js", "MongoDB"],
      location: "New York, USA",
      profileImageUrl: "https://i.pravatar.cc/150?img=12"
    },
    membership: {
      type: "Basic",
      startDate: "2023-09-01T00:00:00Z",
      endDate: "2023-10-01T00:00:00Z",
      autoRenew: false,
      membershipId: "m1"
    }
  },
  {
    _id: "u2",
    username: "jane_smith",
    profile: {
      fullName: "Jane Smith",
      bio: "Project Manager & Entrepreneur",
      skills: ["Project Management", "Marketing", "Business Strategy"],
      location: "San Francisco, USA",
      profileImageUrl: "https://i.pravatar.cc/150?img=2"
    },
    membership: {
      type: "Premium",
      startDate: "2023-09-15T00:00:00Z",
      endDate: "2023-10-15T00:00:00Z",
      autoRenew: true,
      membershipId: "m2"
    }
  }
];
