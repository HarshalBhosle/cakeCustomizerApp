// src/components/Auth/SignOut.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

const SignOut = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <button onClick={handleSignOut} className="btn-signout">
      Logout
    </button>
  );
};

export default SignOut;
