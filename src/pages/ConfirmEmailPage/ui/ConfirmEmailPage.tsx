import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEmailConfirmation } from 'shared/hooks/useEmailConfirmation';
import { Loader } from 'shared/ui/Loader';

export const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [canNavigate, setCanNavigate] = useState(false);

  // Callback to be called when confirmation is complete
  const handleConfirmationComplete = useCallback(() => {
    setCanNavigate(true);
  }, []);

  // Call useEmailConfirmation HERE, on the ConfirmEmailPage
  // This ensures the mutation completes BEFORE navigation
  useEmailConfirmation(email, token, handleConfirmationComplete);

  useEffect(() => {
    if (!token || !email) {
      navigate('/', { replace: true });
    }
  }, [token, email, navigate]);

  useEffect(() => {
    if (canNavigate) {
      navigate('/', { replace: true });
    }
  }, [canNavigate, navigate]);

  return <Loader />;
};
