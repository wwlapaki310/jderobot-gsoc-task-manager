import React from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logoutRequest } from '../redux/authSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logoutRequest());
  };

  return (
    <header className="app-header">
      <div className="user-info">
        {currentUser && <span>こんにちは、{currentUser.username}さん</span>}
        <button onClick={handleLogout} className="logout-btn">
          ログアウト
        </button>
      </div>
    </header>
  );
};

export default Header;