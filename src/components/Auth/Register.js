import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, PhoneAuthProvider, MultiFactorResolver, multiFactor, PhoneMultiFactorGenerator } from 'firebase/auth';

import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [wantsMFA, setWantsMFA] = useState(false);
  const [verificationId, setVerificationId] = useState(null);


  const containerStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: 'row', // Arrange children in a row (form and image)
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa', // Light background
    padding: '20px',
    gap: '40px', // Add space between the form and the image
 }), []);

  const boxStyle = useMemo(() => ({
    backgroundColor: '#ffffff', // White background for the box
    padding: '30px', // Adjusted padding slightly
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px', // Max width for the box
    textAlign: 'left',
 }), []);

  const imageStyle = useMemo(() => ({
    width: '100%',
    maxWidth: '500px', // Max width for the image
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    objectFit: 'cover', // Ensure the image covers the area without distortion
   flexShrink: 0, // Prevent the image from shrinking
 }), []);


  const formGroupStyle = {
    marginBottom: '20px',
    textAlign: 'left',
    width: '100%',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    boxSizing: 'border-box', // Include padding and border in the element's total width
    fontSize: '1rem',
    backgroundColor: '#e9ecef', // Light grey background for input fields
    border: 'none',
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }


    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Optional: Update the user's display name
      try {
        await updateProfile(user, {
          displayName: name,
        });
      } catch (profileError) {
        console.error("Error updating profile:", profileError);
      }

      // Create a Firestore document for the user
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(),
        orders: [],
      });

      // Optional: Enroll in MFA if requested and phone number is provided
      if (wantsMFA && phoneNumber) {
        const phoneProvider = new PhoneAuthProvider(auth); // Moved inside the try block for better scope
        try {
          // Request a verification code to the user's phone number
          // window.recaptchaVerifier should be set up elsewhere (e.g., in your App.js or a dedicated MFA setup component)
          // For simplicity here, we are assuming its presence. You might need to add the reCAPTCHA widget to your page.
          const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber, window.recaptchaVerifier); // Ensure window.recaptchaVerifier is initialized
          setVerificationId(verificationId);

          // We don't complete the MFA enrollment here during registration.
          // This is typically done in a separate step after the user has
          // verified their phone number (e.g., in a profile settings section).
          // We just send the verification code as part of the registration
          // flow if MFA is requested. The user will need to go to their profile
          // to finalize the MFA setup with the received code.

          alert('Verification code sent to your phone. Please complete MFA setup in your profile.');
        }
 catch (mfaError) {
          console.error("Error enrolling in MFA:", mfaError);
          setError('Failed to send MFA verification code.');
        }
      }
      navigate('/');
      alert('Registration successful!'); // Add a success message
    } 
 catch (error) {
      console.error("Registration failed:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      }
    }

    setLoading(false);
  };

  const navigate = useNavigate(); // Moved navigate here

  return (
    <div style={containerStyle} className="register-page-container"> {/* This is the single parent div */}
      <div style={boxStyle}> {/* This div wraps the form and related content */}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            value={name}
            style={inputStyle}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            style={inputStyle}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            value={password}
            style={inputStyle}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password"
            value={confirmPassword}
            style={inputStyle}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={wantsMFA}
              onChange={(e) => setWantsMFA(e.target.checked)}
            />
            Enable Multi-Factor Authentication (MFA) with phone number
          </label>
        </div> 
        {wantsMFA && (
          <div style={formGroupStyle}>
            <label htmlFor="phone-number">Phone Number (for MFA)</label>
            <input
              type="tel"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={inputStyle}
            />

          </div>
        )} 
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'} 
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
    <img src="/Chocolate-Strawberry-Cake.jpg" alt="Chocolate-Strawberry-Cake" style={imageStyle} />
    </div> 
  );
};

export default Register;
