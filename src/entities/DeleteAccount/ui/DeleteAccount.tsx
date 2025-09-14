import { useState } from 'react';
import { useDeleteAccount } from 'shared/hooks';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './DeleteAccount.module.scss';

export const DeleteAccount = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { deleteAccount, loading } = useDeleteAccount();

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    deleteAccount();
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <div className={cls.confirmationCard}>
        <h3 className={cls.confirmationTitle}>Delete Account</h3>
        <p className={cls.confirmationText}>
          Are you sure you want to delete your account? This action cannot be undone and all your data, including
          reviews and ratings, will be permanently removed.
        </p>
        <div className={cls.confirmationButtons}>
          <RegularButton
            type="button"
            theme="error"
            variant="solid"
            onClick={handleConfirmDelete}
            disabled={loading}
            className={cls.deleteButton}
          >
            {loading ? 'Deleting...' : 'Yes, Delete Account'}
          </RegularButton>
          <RegularButton
            type="button"
            theme="neutral"
            variant="solid"
            onClick={handleCancelDelete}
            disabled={loading}
            className={cls.cancelButton}
          >
            Cancel
          </RegularButton>
        </div>
      </div>
    );
  }

  return (
    <div className={cls.deleteAccountCard}>
      <p className={cls.deleteDescription}>Once you delete your account, there is no going back. Please be certain.</p>
      <RegularButton
        type="button"
        theme="error"
        variant="solid"
        onClick={handleDeleteClick}
        className={cls.deleteButton}
      >
        Delete Account
      </RegularButton>
    </div>
  );
};
