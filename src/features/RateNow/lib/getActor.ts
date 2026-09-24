import { type User } from 'shared/types';

export type Actor = 'user' | 'guest';

/** Who contributed, as sent with every analytics event. */
export const getActor = (user: User | null): Actor => (user ? 'user' : 'guest');
