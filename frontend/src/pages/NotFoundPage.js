import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <p>
        <Link to="/">Go to Homepage</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;