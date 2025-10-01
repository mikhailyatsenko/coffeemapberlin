import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      navigate('/', { state: { token, email }, replace: true });
      return;
    }
    navigate('/', { replace: true });
  }, [token, email, navigate]);

  return null;
};
