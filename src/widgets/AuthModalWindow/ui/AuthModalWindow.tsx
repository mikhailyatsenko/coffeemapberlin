import { AuthModalContent } from 'features/AuthModalContent';
import { useAuth } from 'shared/hooks';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';

export const AuthModalWindow = () => {
  const { authModalContentVariant, setAuthModalContentVariant, isLoading } = useAuth();

  return (
    <PortalToBody>
      {authModalContentVariant && (
        <Modal
          onClose={() => {
            setAuthModalContentVariant(null);
          }}
        >
          <AuthModalContent
            setAuthModalContentVariant={setAuthModalContentVariant}
            currentContent={authModalContentVariant}
          />
        </Modal>
      )}
      {isLoading && <Loader />}
    </PortalToBody>
  );
};
