export interface LoginRequiredProps {
  onSwitchToSignIn: () => void;
  onSwitchToSignUp: () => void;
  setError: (error: Error | null) => void;
}
