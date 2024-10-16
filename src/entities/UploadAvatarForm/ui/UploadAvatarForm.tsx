import { useState } from 'react';
import { Loader } from 'shared/ui/Loader';
import { RegularButton } from 'shared/ui/RegularButton';
import fileIcon from '../../../shared/assets/file-icon.svg';
import uploadIcon from '../../../shared/assets/upload-icon.svg';
import cls from './UploadAvatarForm.module.scss';

interface UploadAvatarFormProps {
  avatar: string | null;
  displayName: string;
  handleUpload: () => void;
  handleDelete?: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement> | null) => void;
  isError: string | null;
  isUploading: boolean;
}

export const UploadAvatarForm = ({
  avatar,
  displayName,
  handleFileChange,
  handleUpload,
  handleDelete,
  isError,
  isUploading,
}: UploadAvatarFormProps) => {
  const [isUploadFormActive, setIsUploadFormActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCancel = () => {
    setIsUploadFormActive(false);
    setSelectedFile(null);
    handleFileChange(null);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      handleFileChange(event);
    }
  };
  if (isUploading) return <Loader />;
  return (
    <div className={cls.settingsPictureSection}>
      <div className={cls.settingsPicture}>
        {!isUploadFormActive && (
          <div className={cls.image}>
            <div className={cls.profileAvatar}>
              <img src={avatar || './user-default-icon.svg'} alt={`${displayName}'s avatar`} />
            </div>
            <div className={cls.pictureRequirements}>
              <h4>Profile picture</h4>
              <p>PNG, JPEG under 200KB</p>
            </div>
          </div>
        )}
        {selectedFile && <span>{selectedFile.name}</span>}
        <div className={cls.buttons}>
          {!isUploadFormActive ? (
            <>
              <RegularButton
                clickHandler={() => {
                  setIsUploadFormActive(true);
                }}
              >
                Upload new picture
              </RegularButton>
              {handleDelete && (
                <RegularButton theme="blank" clickHandler={handleDelete}>
                  Delete
                </RegularButton>
              )}
            </>
          ) : (
            <>
              <input
                type="file"
                id="fileInput"
                accept="image/png, image/jpeg"
                className={cls.hiddenInput}
                onChange={onFileChange}
              />

              {!selectedFile ? (
                <label htmlFor="fileInput" className={cls.customFileUpload}>
                  <img className={cls.buttonIcon} src={fileIcon} alt="" /> Choose file
                </label>
              ) : (
                <RegularButton clickHandler={handleUpload} disabled={!selectedFile}>
                  <img className={cls.buttonIcon} src={uploadIcon} alt="" /> Upload now
                </RegularButton>
              )}

              <RegularButton theme="blank" clickHandler={handleCancel}>
                Cancel
              </RegularButton>
            </>
          )}
        </div>
        {isError && <div className={cls.uploadError}>{isError}</div>}
      </div>
    </div>
  );
};
