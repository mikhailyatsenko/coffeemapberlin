export interface User {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  createdAt?: Date;
  isGoogleUserUserWithoutPassword: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
}
