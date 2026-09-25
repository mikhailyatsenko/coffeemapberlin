export interface AddTextReviewFormProps extends React.HTMLAttributes<HTMLFormElement> {
  placeId: string;
  initialValue?: string;
  /** Photos the person's Review for the Place already has; they count against its limit. */
  existingPhotoCount?: number;
  className?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}
