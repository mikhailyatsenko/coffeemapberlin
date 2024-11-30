import { AuthModal } from 'features/AuthModal';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
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
          <AuthModal initialContent={authModalType} />
        </Modal>
      )}
    </PortalToBody>
  );
};
