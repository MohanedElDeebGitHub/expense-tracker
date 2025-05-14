import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [accname, setAccname] = useState('');
  const [accpassword, setAccpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Use renamed context values: loadingAuth, authError, setAuthError
  const { register, authError, setAuthError, loadingAuth } = useAuth();
  const [formError, setFormError] = useState(''); // For client-side validation like password mismatch
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear local form error
    if (setAuthError) setAuthError(null); // Clear global auth error from context

    if (accpassword !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      await register(name, accname, accpassword);
      navigate('/dashboard');
    } catch (err) {
      // Error is set in AuthContext by the register function
      console.error("Registration attempt failed in component:", err.message);
      // No need to setAuthError here, it's handled by the context's register method.
      // If err.message is not user-friendly enough, you might map it here or display a generic message.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form card"> {/* Added card for consistent styling */}
      <h2>Register</h2>
      {/* Display client-side form error first, then context error if any */}
      {formError && <p className="error-message">{formError}</p>}
      {!formError && authError && <p className="error-message">{authError}</p>}
      <div>
        <label htmlFor="register-name">Full Name:</label>
        <input
          type="text"
          id="register-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loadingAuth}
        />
      </div>
      <div>
        <label htmlFor="register-accname">Account Name (Username):</label>
        <input
          type="text"
          id="register-accname"
          value={accname}
          onChange={(e) => setAccname(e.target.value)}
          required
          disabled={loadingAuth}
        />
      </div>
      <div>
        <label htmlFor="register-accpassword">Password:</label>
        <input
          type="password"
          id="register-accpassword"
          value={accpassword}
          onChange={(e) => setAccpassword(e.target.value)}
          required
          disabled={loadingAuth}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loadingAuth}
        />
      </div>
      <button type="submit" disabled={loadingAuth}>
        {loadingAuth ? 'Registering...' : 'Register'}
      </button>
      <p className="form-switch-text">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </form>
  );
};

export default RegisterForm;