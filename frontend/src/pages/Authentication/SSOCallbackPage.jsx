import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SSOCallbackPage = () => {
  const navigate = useNavigate();
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    if (isProcessed) {
      console.log(" Already processed, skipping re-render.");
      return;
    }

    console.log(" Full Callback URL →", window.location.href);

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    const name = params.get('name');

    console.log(" Received SSO Callback Data →", {
      token,
      role,
      name
    });

    if (!token || !role || !name) {
      console.error(" One or more parameters are missing");
      toast.error("Google SSO failed. Missing data.");
      navigate('/login');
      return;
    }

    //  Sanitize the role
    const cleanRole = role.trim().toLowerCase();
    console.log(" Cleaned Role Value →", cleanRole);

    //  Save to LocalStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('role', cleanRole);
    localStorage.setItem('user', JSON.stringify({ role: cleanRole, name }));

    console.log(" Local Storage Saved: ", {
      accessToken: localStorage.getItem('accessToken'),
      role: localStorage.getItem('role'),
      user: localStorage.getItem('user')
    });

    //  Prevent double-processing
    setIsProcessed(true);

    // NEW: Navigate without reloading
    if (cleanRole === "pending") {
      toast.info("You need to complete your role request.");
      console.log(" Role is Pending, navigating to Request Role...");

      //  Remove `/sso/callback` from the history
      window.history.replaceState(null, '', '/request-role');
      navigate('/request-role', { replace: true });
    } else {
      console.log(" Role is not Pending, navigating to Home...");
      window.history.replaceState(null, '', '/home');
      navigate('/home', { replace: true });
    }
  }, [navigate, isProcessed]);

  return (
    <div>
      <h2>Processing Google SSO...</h2>
    </div>
  );
};

export default SSOCallbackPage;
