import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { UploadAvatarForm } from 'entities/UploadAvatarForm';
import { useUploadAvatarMutation, useDeleteAvatarMutation } from 'shared/generated/graphql';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { Loader } from 'shared/ui/Loader';

interface UploadResponse {
  fileUrl?: string;
  error?: string;
}

export const AvatarUpload: React.FC = () => {
  const { user } = useAuthStore();

  const [isError, setIsError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [uploadAvatar, { error: uploadError }] = useUploadAvatarMutation();
  const [deleteAvatar, { error: deleteError }] = useDeleteAvatarMutation();

  const [isUploading, setIsUploading] = useState<boolean>(false);

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

      if (!responseData.fileUrl) {
        setIsError('Failed to get file URL from server');
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
        await checkAuth();
        setIsUploading(false);
        toast.success('Avatar uploaded successfully');
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
        await checkAuth();
        toast.success('Avatar deleted successfully');
      }
    } catch (error) {
      setIsError('An unexpected error occurred during avatar deletion.');
    }

    setIsUploading(false);
  };

  if (!user) return null;

  return (
    <>
      {isUploading ? <Loader /> : null}
      <UploadAvatarForm
        avatar={user?.avatar || undefined}
        displayName={user?.displayName}
        handleFileChange={handleFileChange}
        handleUpload={handleUploadAvatar}
        handleDelete={user.avatar ? handleDeleteAvatar : undefined}
        isError={isError}
        isUploading={isUploading}
      />
    </>
  );
};
