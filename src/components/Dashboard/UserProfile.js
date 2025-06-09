// src/components/Dashboard/UserProfile.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import api from '../../services/api';

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/users/${currentUser.uid}`);
        setProfile(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.error('Error fetching user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await api.put(`/users/${currentUser.uid}`, profile);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profile.name) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile">
      <h2>My Profile</h2>
      {error && <div className="error-message">{error}</div>}
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              disabled
            />
            <small>Email cannot be changed</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Delivery Address</label>
            <textarea
              id="address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)} 
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-group">
            <span className="label">Name:</span>
            <span className="value">{profile.name}</span>
          </div>
          
          <div className="info-group">
            <span className="label">Email:</span>
            <span className="value">{profile.email}</span>
          </div>
          
          <div className="info-group">
            <span className="label">Phone:</span>
            <span className="value">{profile.phone || 'Not provided'}</span>
          </div>
          
          <div className="info-group">
            <span className="label">Address:</span>
            <span className="value">{profile.address || 'Not provided'}</span>
          </div>
          
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;