import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { UploadAvatarForm } from 'entities/UploadAvatarForm';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { UPLOAD_AVATAR, DELETE_AVATAR } from 'shared/query/apolloQueries';
import { Loader } from 'shared/ui/Loader';
import Toast from 'shared/ui/ToastMessage/Toast';

interface UploadResponse {
  fileUrl?: string;
  error?: string;
}

export const AvatarUpload: React.FC = () => {
  const { user, checkAuth, loading: authLoading } = useAuth();
  const [isError, setIsError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [toastMessage, setToastMessage] = useState<string>('');

  const [uploadAvatar, { error: uploadError }] = useMutation<{ uploadAvatar: { success: boolean } }>(UPLOAD_AVATAR);
  const [deleteAvatar, { error: deleteError }] = useMutation<{ deleteAvatar: { success: boolean } }>(DELETE_AVATAR);

  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!user) return null;
  if (authLoading) return <Loader />;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > 200 * 1024) {
        setIsError('File size exceeds 200KB. Please upload a smaller file.');
        return;
      }
      setFile(event.target.files[0]);
    }
    setIsError(null);
  };

  const handleUploadAvatar = async () => {
    if (!file || !user) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('avatar', file);

    try {
      const response = await fetch(
        process.env.VITE_ENV === 'development'
          ? 'http://localhost:3000/upload-avatar'
          : 'https://yatsenko.site/upload-avatar',
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        },
      );

      const responseData: UploadResponse = await response.json();

      if (responseData.error) {
        setIsError(responseData.error);
        setIsUploading(false);
        return;
      }

      const { data } = await uploadAvatar({
        variables: {
          userId: user.id,
          fileUrl: responseData.fileUrl,
        },
      });

      if (uploadError?.message) {
        setIsUploading(false);
        setIsError(uploadError.message);
      }

      if (data?.uploadAvatar.success) {
        checkAuth();
        setIsUploading(false);
        setToastMessage('Avatar uploaded successfully');
      }
    } catch (error) {
      setIsError('An unexpected error occurred during avatar upload.');
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    const isConfirmed = window.confirm('Deleting avatar. Continue?');
    if (!isConfirmed) return;

    setIsUploading(true);

    try {
      const { data } = await deleteAvatar();

      if (deleteError?.message) {
        setIsError(deleteError.message);
        setIsUploading(false);
        return;
      }

      if (data?.deleteAvatar.success) {
        checkAuth();
        setToastMessage('Avatar deleted successfully');
      }
    } catch (error) {
      setIsError('An unexpected error occurred during avatar deletion.');
    }

    setIsUploading(false);
  };

  return (
    <>
      <UploadAvatarForm
        avatar={user?.avatar}
        displayName={user?.displayName}
        handleFileChange={handleFileChange}
        handleUpload={handleUploadAvatar}
        handleDelete={user.avatar ? handleDeleteAvatar : undefined}
        isError={isError}
        isUploading={isUploading}
      />
      <Toast message={toastMessage} theme="green" />
    </>
  );
};
