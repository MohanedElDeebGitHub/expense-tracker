import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = () => {
  const [accname, setAccname] = useState('');
  const [accpassword, setAccpassword] = useState('');
  // Use renamed context values: loadingAuth, authError, setAuthError
  const { login, authError, setAuthError, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setAuthError) setAuthError(null); // Clear previous auth errors

    try {
      await login(accname, accpassword);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is already set in AuthContext by the login function if it throws
      // No need to setAuthError(err.message) here as login function does it.
      console.error("Login attempt failed in component:", err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form card"> {/* Added card for consistent styling */}
      <h2>Login</h2>
      {authError && <p className="error-message">{authError}</p>}
      <div>
        <label htmlFor="login-accname">Account Name (Username):</label>
        <input
          type="text"
          id="login-accname"
          value={accname}
          onChange={(e) => setAccname(e.target.value)}
          required
          disabled={loadingAuth}
        />
      </div>
      <div>
        <label htmlFor="login-accpassword">Password:</label>
        <input
          type="password"
          id="login-accpassword"
          value={accpassword}
          onChange={(e) => setAccpassword(e.target.value)}
          required
          disabled={loadingAuth}
        />
      </div>
      <button type="submit" disabled={loadingAuth}>
        {loadingAuth ? 'Logging in...' : 'Login'}
      </button>
      <p className="form-switch-text">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </form>
  );
};

export default LoginForm;