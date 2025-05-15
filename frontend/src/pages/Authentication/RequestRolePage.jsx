import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequestRolePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log(" RequestRolePage Loaded");

    //  Safely get data from localStorage
    const accessToken = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    const user = JSON.parse(localStorage.getItem('user') ?? "{}");

    console.log(" Local Storage Data →", {
      accessToken,
      role,
      user
    });

    if (!accessToken || !role || !user.name) {
      console.error(" Missing user data in localStorage");
      toast.error("You are not authenticated. Redirecting to login...");
      navigate('/login');
      return;
    }

    //  Make role lowercase and trim spaces safely
    const cleanRole = role.trim().toLowerCase();

    if (cleanRole !== 'pending') {
      console.warn(" Role is not pending. Redirecting to home...");
      navigate('/home');
      return;
    }

    console.log(" Role is pending. Loading data...");
    setUserData(user);
  }, [navigate]);

  return (
    <div>
      <h2>Request Your Role</h2>
      {userData ? (
        <p>Welcome, {userData.name}. Please complete your role request.</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RequestRolePage;
