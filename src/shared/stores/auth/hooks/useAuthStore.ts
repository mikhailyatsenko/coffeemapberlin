import { create } from 'zustand';

import { INITIAL_STATE } from '../constants';
import { type AuthState } from '../types';

export const useAuthStore = create<AuthState>(() => INITIAL_STATE);
