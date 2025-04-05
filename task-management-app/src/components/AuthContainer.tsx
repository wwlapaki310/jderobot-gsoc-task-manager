import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthContainer: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  const toggleView = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="auth-container">
      {showRegister ? (
        <Register onToggleView={toggleView} />
      ) : (
        <Login onToggleView={toggleView} />
      )}
    </div>
  );
};

export default AuthContainer;