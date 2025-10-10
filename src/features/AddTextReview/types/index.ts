export interface AddTextReviewFormProps {
  placeId: string;
  initialValue?: string;
  className?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export interface ImageUploadProgress {
  name: string;
  progress: number; // 0-100
  localUrl: string;
  error?: string;
}
