import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { AuthModalContent } from 'shared/ui/authModalContent';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';

export const AuthModalWindow = () => {
  const { authModalType, setAuthModalType } = useAuth();

  return (
    <PortalToBody>
      {authModalType && (
        <Modal
          onClose={() => {
            setAuthModalType(null);
          }}
        >
          <AuthModalContent initialContent={authModalType} />
        </Modal>
      )}
    </PortalToBody>
  );
};
