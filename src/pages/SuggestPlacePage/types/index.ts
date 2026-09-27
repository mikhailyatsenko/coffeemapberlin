export interface SuggestPlaceFormValues {
  name: string;
  address: string;
  description: string;
  instagram: string;
  /** Asked of Guests only. */
  email: string;
}

/** Who is suggesting; `unknown` while the session check is still running. */
export type Suggester = 'user' | 'guest' | 'unknown';

export interface SubmittedSuggestion {
  /** Whether the suggester hears back when the Place is added. */
  willEmail: boolean;
}
