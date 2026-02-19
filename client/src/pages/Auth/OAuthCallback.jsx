import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      login(token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate(`/login${error ? `?error=${encodeURIComponent(error)}` : ''}`, { replace: true });
    }
  }, [params, login, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      Signing you in...
    </div>
  );
}
