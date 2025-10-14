import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { UploadAvatarForm } from 'entities/UploadAvatarForm';
import { useUploadAvatarMutation, useDeleteAvatarMutation } from 'shared/generated/graphql';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { Loader } from 'shared/ui/Loader';

export const AvatarUpload: React.FC = () => {
  const { user } = useAuthStore();

  const [isError, setIsError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [uploadAvatar, { error: uploadError }] = useUploadAvatarMutation();
  const [deleteAvatar, { error: deleteError }] = useDeleteAvatarMutation();

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileToBase64 = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement> | null) => {
    if (event?.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size > 5 * 1024 * 1024) {
        setIsError('File size exceeds 5MB. Please upload a smaller file.');
        return;
      }
      setFile(event.target.files[0]);
    }
    setIsError(null);
  };

  const handleUploadAvatar = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setIsError(null);

    try {
      const fileBuffer = await fileToBase64(file);

      const { data } = await uploadAvatar({
        variables: {
          userId: user.id,
          fileBuffer,
          fileName: file.name,
        },
      });

      if (uploadError?.message) {
        setIsError(uploadError.message);
        setIsUploading(false);
        return;
      }

      if (data?.uploadAvatar.success) {
        await checkAuth();
        setIsUploading(false);
        toast.success('Avatar uploaded successfully');
        setFile(null);
      } else {
        setIsError('Failed to upload avatar');
        setIsUploading(false);
      }
    } catch (error) {
      setIsError('An unexpected error occurred during avatar upload.');
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    const isConfirmed = window.confirm('Delete avatar. Continue?');
    if (!isConfirmed) return;

    setIsUploading(true);
    setIsError(null);

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
      } else {
        setIsError('Failed to delete avatar');
      }
    } catch (error) {
      console.error('Delete error:', error);
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
