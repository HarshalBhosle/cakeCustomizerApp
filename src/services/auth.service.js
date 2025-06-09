// src/services/auth.service.js
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Register new user
export const register = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: name
    });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      name,
      createdAt: new Date()
    });
    
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Logout user
export const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Alias for logout (to fix Header.js import)
export const logoutUser = logout;

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Get user profile data from Firestore
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("User profile not found");
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export default {
  register,
  login,
  logout,
  logoutUser,
  getCurrentUser,
  getUserProfile
};