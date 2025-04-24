import { useApolloClient, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'shared/api';
import { LOGOUT_MUTATION, SIGN_IN_WITH_EMAIL } from 'shared/query/apolloQueries';

export const useAuthHandlers = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [signInWithEmail] = useMutation(SIGN_IN_WITH_EMAIL);

  const { setIsLoading, setUser, setError, setAuthModalContentVariant, checkAuth } = useAuth();

  const signInWithEmailHandler = async (data: SignInWithEmailData) => {
    setIsLoading(true);
    try {
      const response = await signInWithEmail({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
      if (response) {
        await checkAuth();
        setAuthModalContentVariant(null);
        setIsLoading(false);
        await client.resetStore();
      }
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err : new Error('An unknown error occurred during sign in'));
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await client.mutate({ mutation: LOGOUT_MUTATION });
      setUser(null);
      navigate('/', { replace: true });
      await client.resetStore();
      setIsLoading(false);
      setError(null);
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error : new Error('An unknown error occurred during logout'));
    }
  };

  return {
    signInWithEmailHandler,
    logout,
    setAuthModalContentVariant,
  };
};
