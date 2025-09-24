import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { revalidatePlaces } from 'shared/stores/places';
import { useDeleteAccountMutation } from '../generated/graphql';
import { clearAuth } from '../stores/auth';

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const [deleteAccountMutation, { loading, error }] = useDeleteAccountMutation({
    onCompleted: (data) => {
      if (data.deleteAccount.success) {
        toast.success('Account deleted successfully');
        revalidatePlaces();
        clearAuth().then(() => {
          navigate('/');
        });
      } else {
        toast.error('Failed to delete account');
      }
    },
    onError: (error) => {
      console.error('Delete account error:', error);
      toast.error('An error occurred while deleting your account');
    },
  });

  const deleteAccount = async () => {
    try {
      await deleteAccountMutation();
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };

  return {
    deleteAccount,
    loading,
    error,
  };
};
