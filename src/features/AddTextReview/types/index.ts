export interface AddTextReviewFormProps {
  placeId: string;
  initialValue?: string;
  className?: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export interface ImagesWrapper {
  name: string;
  file: File;
  progress: number; // 0-100
  localUrl: string;
  error?: string;
}
