const AdminDashboard = () => {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
  
        <div className="grid gap-4">
          <div className="card">Manage Users</div>
          <div className="card">Manage Projects</div>
          <div className="card">Payments Overview</div>
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;
  