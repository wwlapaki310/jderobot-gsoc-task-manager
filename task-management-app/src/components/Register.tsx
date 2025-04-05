import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { registerRequest, clearError } from '../redux/authSlice';

const Register: React.FC<{ onToggleView: () => void }> = ({ onToggleView }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
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
    setValidationError(null);
    
    if (password !== confirmPassword) {
      setValidationError('パスワードが一致しません');
      return;
    }
    
    dispatch(registerRequest({ username, password }));
  };

  return (
    <div className="register-container">
      <h2>ユーザー登録</h2>
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
        <div className="form-group">
          <label>パスワード（確認）</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {validationError && <div className="error">{validationError}</div>}
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn-primary">登録</button>
      </form>
      <p>
        すでにアカウントをお持ちの方は
        <button onClick={onToggleView} className="btn-link">
          ログイン
        </button>
      </p>
    </div>
  );
};

export default Register;