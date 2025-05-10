import { INITIAL_STATE } from '../constants';
import { useAuthStore } from '../hooks';
import { type User } from '../types';

export const setAuth = (user: User) => {
  useAuthStore.setState({ user });
};

export const clearAuth = () => {
  useAuthStore.setState(INITIAL_STATE);
};
