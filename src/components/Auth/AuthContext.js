import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../../services/firebase';
import { multiFactor, PhoneAuthProvider, PhoneMultiFactorGenerator } from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Function to enroll a phone number for MFA
  const enrollMfa = async (phoneNumber) => {
    const phoneProvider = new PhoneAuthProvider(auth);
    const session = await multiFactor(currentUser).getSession();
    // Firebase v9 SDK requires a reCAPTCHA verifier for verifyPhoneNumber
    // This needs to be handled in the component where enrollMfa is called
    const verificationId = await phoneProvider.verifyPhoneNumber({
      phoneNumber: phoneNumber,
      session: session,
    });
    return verificationId;
  };

  // Function to challenge MFA with a phone number and verification code
  const challengeMfa = async (verificationId, verificationCode) => {
    const phoneAuthCredential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(
      phoneAuthCredential
    );
    await multiFactor(currentUser).enroll(multiFactorAssertion, 'Phone Number'); // Added name for the factor
  };

  // Function to handle login/registration with potential MFA challenge
  const handleAuthWithMfa = async (authPromise, phoneNumber = null) => {
    try {
      const userCredential = await authPromise;
      if (userCredential && userCredential.user && userCredential.user.multiFactor && userCredential.user.multiFactor.enrolledFactors.length > 0) {
        // MFA is enabled, initiate the challenge - no longer done here, handled in the component
        // This part needs to be handled in the Login/Register components
        // prompting the user for the MFA code
        return { requiresMfa: true, user: userCredential.user };
      } else if (phoneNumber) {
        // No MFA enrolled yet, enroll the provided phone number
        await enrollMfa(phoneNumber);
        return { requiresMfa: false, user: userCredential.user };
      } else {
        return { requiresMfa: false, user: userCredential.user };
      }
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    loading, // Added comma
    enrollMfa,
    challengeMfa,
    handleAuthWithMfa,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
