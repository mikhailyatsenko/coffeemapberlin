import { readGuestIdentity } from 'shared/lib/guest';
import { useAuthStore } from 'shared/stores/auth';

/** Whether the viewer has proved who they are: a signed-in User, or a stored Guest identity. */
export const useHasProvenIdentity = (): boolean => {
  const user = useAuthStore((s) => s.user);
  return Boolean(user) || Boolean(readGuestIdentity());
};
