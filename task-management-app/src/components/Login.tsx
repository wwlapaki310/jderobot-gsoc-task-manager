import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { loginRequest, clearError } from '../redux/authSlice';

const Login: React.FC<{ onToggleView: () => void }> = ({ onToggleView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(state => state.auth);

  // コンポーネントがアンマウントされるときにエラーをクリア
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest({ username, password }));
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ユーザー名</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn-primary">ログイン</button>
      </form>
      <p>
        アカウントをお持ちでない方は
        <button onClick={onToggleView} className="btn-link">
          新規登録
        </button>
      </p>
    </div>
  );
};

export default Login;