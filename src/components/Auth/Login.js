import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, PhoneAuthProvider, multiFactor, getMultiFactorResolver } from 'firebase/auth';
import { AuthContext } from './AuthContext';
import { auth } from '../../services/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [mfaResolver, setMfaResolver] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const containerStyle = useMemo(() => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    gap: '40px',
  }), []);

  const boxStyle = useMemo(() => ({
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'left',
  }), []);

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: '#e9ecef',
    border: 'none',
    marginBottom: '20px',
  };

  const imageStyle = useMemo(() => ({
    width: '100%',
    maxWidth: '500px',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    objectFit: 'cover',
    flexShrink: 0,
  }), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, err);
        setMfaResolver(resolver);
        alert('MFA required. Enter the verification code sent to your phone.');
      } else {
        setError('Login failed: ' + err.message);
      }
    }

    setLoading(false);
  };

  const handleMfaVerification = async () => {
    if (!mfaResolver) return;

    try {
      const cred = PhoneAuthProvider.credential(mfaResolver.hints[0].uid, verificationCode);
      const multiFactorAssertion = PhoneAuthProvider.credential(mfaResolver.hints[0].uid, verificationCode);
      const finalResult = await mfaResolver.resolveSignIn(multiFactorAssertion);

      alert('MFA successful. Logged in!');
      navigate('/');
    } catch (mfaError) {
      setError('MFA Verification Failed: ' + mfaError.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2>Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {!mfaResolver ? (
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <div>
            <label>Enter MFA Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              style={inputStyle}
            />
            <button onClick={handleMfaVerification} className="btn-primary">
              Verify & Login
            </button>
          </div>
        )}
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
      <img src="/Chocolate-Strawberry-Cake.jpg" alt="Login Visual" style={imageStyle} />
    </div>
  );
};

export default Login;
