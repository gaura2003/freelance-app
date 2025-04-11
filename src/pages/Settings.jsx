const Settings = () => {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
  
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="Full Name" className="input" />
          <input type="email" placeholder="Email" className="input" />
          <input type="password" placeholder="New Password" className="input" />
  
          <button className="btn-primary">Update Profile</button>
        </form>
      </div>
    );
  };
  
  export default Settings;
  