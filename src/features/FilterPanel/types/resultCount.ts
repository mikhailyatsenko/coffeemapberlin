/** What the Filters modal's footer says about how many Places the current Filters match. */
export type ResultCount =
  /** No count yet since the modal opened. */
  | { status: 'counting' }
  /** `isUpdating`: a newer count is pending; `total` is the last one. */
  | { status: 'ready'; total: number; isUpdating: boolean }
  /** The request failed. */
  | { status: 'unavailable' };
