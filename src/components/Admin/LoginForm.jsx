import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import styles     from './AdminDashboard.module.css';

export default function LoginForm() {
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState(false);
  const { login }               = useAdmin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className={styles.loginOverlay}>
      <form className={styles.loginCard} onSubmit={handleSubmit}>
        <h1>Admin Panel</h1>
        <p>Please enter your access password</p>
        
        <input 
          type="password" 
          placeholder="Enter Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.loginInput} ${error ? styles.errorBorder : ''}`}
          autoFocus
        />
        
        {error && <p style={{ color: '#e74c3c', fontSize: '1.4rem', marginBottom: '1rem' }}>Incorrect Password!</p>}
        
        <button type="submit" className={styles.loginBtn}>Unlock Dashboard</button>
      </form>
    </div>
  );
}
