import type { LoginWithGoogleMutation } from 'shared/generated/graphql';

export const mapLoginWithGoogleData = (data: LoginWithGoogleMutation) => {
  const user = data?.loginWithGoogle?.user;

  if (user) {
    return {
      ...user,
      avatar: user.avatar || undefined,
      createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
    };
  }
};
