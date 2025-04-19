import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends Record<string, unknown>> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends Record<string, unknown>, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
}

export interface AddRatingResponse {
  __typename?: 'AddRatingResponse';
  averageRating: Scalars['Float']['output'];
  ratingCount: Scalars['Int']['output'];
  reviewId: Scalars['String']['output'];
  userRating: Scalars['Int']['output'];
}

export interface AddTextReviewResponse {
  __typename?: 'AddTextReviewResponse';
  reviewId: Scalars['String']['output'];
  text: Scalars['String']['output'];
}

export interface AuthPayload {
  __typename?: 'AuthPayload';
  isFirstLogin?: Maybe<Scalars['Boolean']['output']>;
  user: User;
}

export enum Characteristic {
  AffordablePrices = 'affordablePrices',
  DeliciousFilterCoffee = 'deliciousFilterCoffee',
  FreeWifi = 'freeWifi',
  FriendlyStaff = 'friendlyStaff',
  OutdoorSeating = 'outdoorSeating',
  PetFriendly = 'petFriendly',
  PleasantAtmosphere = 'pleasantAtmosphere',
  YummyEats = 'yummyEats',
}

export interface CharacteristicCounts {
  __typename?: 'CharacteristicCounts';
  affordablePrices: CharacteristicData;
  deliciousFilterCoffee: CharacteristicData;
  freeWifi: CharacteristicData;
  friendlyStaff: CharacteristicData;
  outdoorSeating: CharacteristicData;
  petFriendly: CharacteristicData;
  pleasantAtmosphere: CharacteristicData;
  yummyEats: CharacteristicData;
}

export interface CharacteristicData {
  __typename?: 'CharacteristicData';
  count: Scalars['Int']['output'];
  pressed: Scalars['Boolean']['output'];
}

export interface DeleteReviewResult {
  __typename?: 'DeleteReviewResult';
  averageRating: Scalars['Float']['output'];
  ratingCount: Scalars['Int']['output'];
  reviewId: Scalars['ID']['output'];
}

export interface Geometry {
  __typename?: 'Geometry';
  coordinates: Array<Scalars['Float']['output']>;
  type: Scalars['String']['output'];
}

export interface LogoutResponse {
  __typename?: 'LogoutResponse';
  message: Scalars['String']['output'];
}

export interface Mutation {
  __typename?: 'Mutation';
  addRating: AddRatingResponse;
  addTextReview: AddTextReviewResponse;
  deleteAvatar: SuccessResponse;
  deleteReview: DeleteReviewResult;
  loginWithGoogle?: Maybe<AuthPayload>;
  logout?: Maybe<LogoutResponse>;
  registerUser: AuthPayload;
  setNewPassword: SuccessResponse;
  signInWithEmail: AuthPayload;
  toggleCharacteristic: SuccessResponse;
  toggleFavorite: Scalars['Boolean']['output'];
  updatePersonalData: SuccessResponse;
  uploadAvatar: SuccessResponse;
}

export interface MutationAddRatingArgs {
  placeId: Scalars['ID']['input'];
  rating: Scalars['Float']['input'];
}

export interface MutationAddTextReviewArgs {
  placeId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
}

export interface MutationDeleteReviewArgs {
  deleteOptions: Scalars['String']['input'];
  reviewId: Scalars['ID']['input'];
}

export interface MutationLoginWithGoogleArgs {
  code: Scalars['String']['input'];
}

export interface MutationRegisterUserArgs {
  displayName: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}

export interface MutationSetNewPasswordArgs {
  newPassword: Scalars['String']['input'];
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
}

export interface MutationSignInWithEmailArgs {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}

export interface MutationToggleCharacteristicArgs {
  characteristic: Characteristic;
  placeId: Scalars['ID']['input'];
}

export interface MutationToggleFavoriteArgs {
  placeId: Scalars['ID']['input'];
}

export interface MutationUpdatePersonalDataArgs {
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
}

export interface MutationUploadAvatarArgs {
  fileUrl: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
}

export interface Place {
  __typename?: 'Place';
  geometry: Geometry;
  id: Scalars['ID']['output'];
  properties: PlaceProperties;
  type: Scalars['String']['output'];
}

export interface PlaceProperties {
  __typename?: 'PlaceProperties';
  address: Scalars['String']['output'];
  averageRating?: Maybe<Scalars['Float']['output']>;
  characteristicCounts: CharacteristicCounts;
  description: Scalars['String']['output'];
  favoriteCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  image: Scalars['String']['output'];
  instagram: Scalars['String']['output'];
  isFavorite: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  ratingCount: Scalars['Int']['output'];
  reviews: Review[];
}

export interface PlaceReviews {
  __typename?: 'PlaceReviews';
  id: Scalars['ID']['output'];
  reviews: Review[];
}

export interface Query {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getUserReviewActivity: UserReviewActivity[];
  placeReviews: PlaceReviews;
  places: Place[];
}

export interface QueryPlaceReviewsArgs {
  placeId: Scalars['ID']['input'];
}

export interface Review {
  __typename?: 'Review';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isOwnReview: Scalars['Boolean']['output'];
  placeId: Scalars['ID']['output'];
  text: Scalars['String']['output'];
  userAvatar: Scalars['String']['output'];
  userId: Scalars['ID']['output'];
  userName: Scalars['String']['output'];
  userRating?: Maybe<Scalars['Float']['output']>;
}

export interface SuccessResponse {
  __typename?: 'SuccessResponse';
  success: Scalars['Boolean']['output'];
}

export interface User {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isGoogleUserUserWithoutPassword: Scalars['Boolean']['output'];
}

export interface UserReviewActivity {
  __typename?: 'UserReviewActivity';
  averageRating?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['String']['output'];
  placeId: Scalars['ID']['output'];
  placeName: Scalars['String']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  reviewText?: Maybe<Scalars['String']['output']>;
}

export type LoginWithGoogleMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;

export interface LoginWithGoogleMutation {
  __typename?: 'Mutation';
  loginWithGoogle?: {
    __typename?: 'AuthPayload';
    isFirstLogin?: boolean | null;
    user: {
      __typename?: 'User';
      id: string;
      displayName: string;
      email: string;
      avatar?: string | null;
      createdAt?: string | null;
      isGoogleUserUserWithoutPassword: boolean;
    };
  } | null;
}

export type SignInWithEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;

export interface SignInWithEmailMutation {
  __typename?: 'Mutation';
  signInWithEmail: {
    __typename?: 'AuthPayload';
    user: {
      __typename?: 'User';
      id: string;
      displayName: string;
      email: string;
      avatar?: string | null;
      createdAt?: string | null;
      isGoogleUserUserWithoutPassword: boolean;
    };
  };
}

export type CurrentUserQueryVariables = Exact<Record<string, never>>;

export interface CurrentUserQuery {
  __typename?: 'Query';
  currentUser?: {
    __typename?: 'User';
    id: string;
    displayName: string;
    email: string;
    avatar?: string | null;
    createdAt?: string | null;
    isGoogleUserUserWithoutPassword: boolean;
  } | null;
}

export type RegisterUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;

export interface RegisterUserMutation {
  __typename?: 'Mutation';
  registerUser: {
    __typename?: 'AuthPayload';
    user: { __typename?: 'User'; id: string; displayName: string; email: string };
  };
}

export type UpdatePersonalDataMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;

export interface UpdatePersonalDataMutation {
  __typename?: 'Mutation';
  updatePersonalData: { __typename?: 'SuccessResponse'; success: boolean };
}

export type SetNewPasswordMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  oldPassword?: InputMaybe<Scalars['String']['input']>;
  newPassword: Scalars['String']['input'];
}>;

export interface SetNewPasswordMutation {
  __typename?: 'Mutation';
  setNewPassword: { __typename?: 'SuccessResponse'; success: boolean };
}

export type LogoutMutationVariables = Exact<Record<string, never>>;

export interface LogoutMutation {
  __typename?: 'Mutation';
  logout?: { __typename?: 'LogoutResponse'; message: string } | null;
}

export type GetAllPlacesQueryVariables = Exact<Record<string, never>>;

export interface GetAllPlacesQuery {
  __typename?: 'Query';
  places: Array<{
    __typename?: 'Place';
    type: string;
    geometry: { __typename?: 'Geometry'; type: string; coordinates: number[] };
    properties: {
      __typename?: 'PlaceProperties';
      id: string;
      name: string;
      description: string;
      address: string;
      image: string;
      instagram: string;
      averageRating?: number | null;
      ratingCount: number;
      isFavorite: boolean;
      favoriteCount: number;
      characteristicCounts: {
        __typename?: 'CharacteristicCounts';
        pleasantAtmosphere: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
        affordablePrices: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
        friendlyStaff: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
        yummyEats: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
        deliciousFilterCoffee: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
        freeWifi: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
        petFriendly: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
        outdoorSeating: { __typename?: 'CharacteristicData'; pressed: boolean; count: number };
      };
    };
  }>;
}

export type ToggleFavoriteMutationVariables = Exact<{
  placeId: Scalars['ID']['input'];
}>;

export interface ToggleFavoriteMutation {
  __typename?: 'Mutation';
  toggleFavorite: boolean;
}

export type ToggleCharacteristicMutationVariables = Exact<{
  placeId: Scalars['ID']['input'];
  characteristic: Characteristic;
}>;

export interface ToggleCharacteristicMutation {
  __typename?: 'Mutation';
  toggleCharacteristic: { __typename?: 'SuccessResponse'; success: boolean };
}

export type AddRatingMutationVariables = Exact<{
  placeId: Scalars['ID']['input'];
  rating: Scalars['Float']['input'];
}>;

export interface AddRatingMutation {
  __typename?: 'Mutation';
  addRating: {
    __typename?: 'AddRatingResponse';
    averageRating: number;
    ratingCount: number;
    reviewId: string;
    userRating: number;
  };
}

export type AddTextReviewMutationVariables = Exact<{
  placeId: Scalars['ID']['input'];
  text: Scalars['String']['input'];
}>;

export interface AddTextReviewMutation {
  __typename?: 'Mutation';
  addTextReview: { __typename?: 'AddTextReviewResponse'; reviewId: string; text: string };
}

export type DeleteReviewMutationVariables = Exact<{
  reviewId: Scalars['ID']['input'];
  deleteOptions: Scalars['String']['input'];
}>;

export interface DeleteReviewMutation {
  __typename?: 'Mutation';
  deleteReview: { __typename?: 'DeleteReviewResult'; reviewId: string; averageRating: number; ratingCount: number };
}

export type PlaceReviewsQueryVariables = Exact<{
  placeId: Scalars['ID']['input'];
}>;

export interface PlaceReviewsQuery {
  __typename?: 'Query';
  placeReviews: {
    __typename?: 'PlaceReviews';
    id: string;
    reviews: Array<{
      __typename?: 'Review';
      id: string;
      text: string;
      userId: string;
      userName: string;
      userAvatar: string;
      createdAt: string;
      userRating?: number | null;
      isOwnReview: boolean;
    }>;
  };
}

export type GetUserReviewActivityQueryVariables = Exact<Record<string, never>>;

export interface GetUserReviewActivityQuery {
  __typename?: 'Query';
  getUserReviewActivity: Array<{
    __typename?: 'UserReviewActivity';
    rating?: number | null;
    reviewText?: string | null;
    placeId: string;
    placeName: string;
    averageRating?: number | null;
    createdAt: string;
  }>;
}

export type UploadAvatarMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  fileUrl: Scalars['String']['input'];
}>;

export interface UploadAvatarMutation {
  __typename?: 'Mutation';
  uploadAvatar: { __typename?: 'SuccessResponse'; success: boolean };
}

export type DeleteAvatarMutationVariables = Exact<Record<string, never>>;

export interface DeleteAvatarMutation {
  __typename?: 'Mutation';
  deleteAvatar: { __typename?: 'SuccessResponse'; success: boolean };
}

export const LoginWithGoogleDocument = gql`
  mutation LoginWithGoogle($code: String!) {
    loginWithGoogle(code: $code) {
      user {
        id
        displayName
        email
        avatar
        createdAt
        isGoogleUserUserWithoutPassword
      }
      isFirstLogin
    }
  }
`;
export type LoginWithGoogleMutationFn = Apollo.MutationFunction<
  LoginWithGoogleMutation,
  LoginWithGoogleMutationVariables
>;

/**
 * __useLoginWithGoogleMutation__
 *
 * To run a mutation, you first call `useLoginWithGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWithGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWithGoogleMutation, { data, loading, error }] = useLoginWithGoogleMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useLoginWithGoogleMutation(
  baseOptions?: Apollo.MutationHookOptions<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>(
    LoginWithGoogleDocument,
    options,
  );
}
export type LoginWithGoogleMutationHookResult = ReturnType<typeof useLoginWithGoogleMutation>;
export type LoginWithGoogleMutationResult = Apollo.MutationResult<LoginWithGoogleMutation>;
export type LoginWithGoogleMutationOptions = Apollo.BaseMutationOptions<
  LoginWithGoogleMutation,
  LoginWithGoogleMutationVariables
>;
export const SignInWithEmailDocument = gql`
  mutation SignInWithEmail($email: String!, $password: String!) {
    signInWithEmail(email: $email, password: $password) {
      user {
        id
        displayName
        email
        avatar
        createdAt
        isGoogleUserUserWithoutPassword
      }
    }
  }
`;
export type SignInWithEmailMutationFn = Apollo.MutationFunction<
  SignInWithEmailMutation,
  SignInWithEmailMutationVariables
>;

/**
 * __useSignInWithEmailMutation__
 *
 * To run a mutation, you first call `useSignInWithEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInWithEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInWithEmailMutation, { data, loading, error }] = useSignInWithEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInWithEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<SignInWithEmailMutation, SignInWithEmailMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SignInWithEmailMutation, SignInWithEmailMutationVariables>(
    SignInWithEmailDocument,
    options,
  );
}
export type SignInWithEmailMutationHookResult = ReturnType<typeof useSignInWithEmailMutation>;
export type SignInWithEmailMutationResult = Apollo.MutationResult<SignInWithEmailMutation>;
export type SignInWithEmailMutationOptions = Apollo.BaseMutationOptions<
  SignInWithEmailMutation,
  SignInWithEmailMutationVariables
>;
export const CurrentUserDocument = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      email
      avatar
      createdAt
      isGoogleUserUserWithoutPassword
    }
  }
`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
}
export function useCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
}
export function useCurrentUserSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>,
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<typeof useCurrentUserSuspenseQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export const RegisterUserDocument = gql`
  mutation RegisterUser($email: String!, $displayName: String!, $password: String!) {
    registerUser(email: $email, displayName: $displayName, password: $password) {
      user {
        id
        displayName
        email
      }
    }
  }
`;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      email: // value for 'email'
 *      displayName: // value for 'displayName'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterUserMutation(
  baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
}
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<
  RegisterUserMutation,
  RegisterUserMutationVariables
>;
export const UpdatePersonalDataDocument = gql`
  mutation UpdatePersonalData($userId: ID!, $displayName: String, $email: String) {
    updatePersonalData(userId: $userId, displayName: $displayName, email: $email) {
      success
    }
  }
`;
export type UpdatePersonalDataMutationFn = Apollo.MutationFunction<
  UpdatePersonalDataMutation,
  UpdatePersonalDataMutationVariables
>;

/**
 * __useUpdatePersonalDataMutation__
 *
 * To run a mutation, you first call `useUpdatePersonalDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePersonalDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePersonalDataMutation, { data, loading, error }] = useUpdatePersonalDataMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      displayName: // value for 'displayName'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useUpdatePersonalDataMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdatePersonalDataMutation, UpdatePersonalDataMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdatePersonalDataMutation, UpdatePersonalDataMutationVariables>(
    UpdatePersonalDataDocument,
    options,
  );
}
export type UpdatePersonalDataMutationHookResult = ReturnType<typeof useUpdatePersonalDataMutation>;
export type UpdatePersonalDataMutationResult = Apollo.MutationResult<UpdatePersonalDataMutation>;
export type UpdatePersonalDataMutationOptions = Apollo.BaseMutationOptions<
  UpdatePersonalDataMutation,
  UpdatePersonalDataMutationVariables
>;
export const SetNewPasswordDocument = gql`
  mutation SetNewPassword($userId: ID!, $oldPassword: String, $newPassword: String!) {
    setNewPassword(userId: $userId, oldPassword: $oldPassword, newPassword: $newPassword) {
      success
    }
  }
`;
export type SetNewPasswordMutationFn = Apollo.MutationFunction<SetNewPasswordMutation, SetNewPasswordMutationVariables>;

/**
 * __useSetNewPasswordMutation__
 *
 * To run a mutation, you first call `useSetNewPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetNewPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNewPasswordMutation, { data, loading, error }] = useSetNewPasswordMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      oldPassword: // value for 'oldPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useSetNewPasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<SetNewPasswordMutation, SetNewPasswordMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SetNewPasswordMutation, SetNewPasswordMutationVariables>(SetNewPasswordDocument, options);
}
export type SetNewPasswordMutationHookResult = ReturnType<typeof useSetNewPasswordMutation>;
export type SetNewPasswordMutationResult = Apollo.MutationResult<SetNewPasswordMutation>;
export type SetNewPasswordMutationOptions = Apollo.BaseMutationOptions<
  SetNewPasswordMutation,
  SetNewPasswordMutationVariables
>;
export const LogoutDocument = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
}
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const GetAllPlacesDocument = gql`
  query GetAllPlaces {
    places {
      type
      geometry {
        type
        coordinates
      }
      properties {
        id
        name
        description
        address
        image
        instagram
        averageRating
        ratingCount
        isFavorite
        favoriteCount
        characteristicCounts {
          pleasantAtmosphere {
            pressed
            count
          }
          affordablePrices {
            pressed
            count
          }
          friendlyStaff {
            pressed
            count
          }
          yummyEats {
            pressed
            count
          }
          deliciousFilterCoffee {
            pressed
            count
          }
          freeWifi {
            pressed
            count
          }
          petFriendly {
            pressed
            count
          }
          outdoorSeating {
            pressed
            count
          }
        }
      }
    }
  }
`;

/**
 * __useGetAllPlacesQuery__
 *
 * To run a query within a React component, call `useGetAllPlacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPlacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPlacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPlacesQuery(
  baseOptions?: Apollo.QueryHookOptions<GetAllPlacesQuery, GetAllPlacesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAllPlacesQuery, GetAllPlacesQueryVariables>(GetAllPlacesDocument, options);
}
export function useGetAllPlacesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetAllPlacesQuery, GetAllPlacesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAllPlacesQuery, GetAllPlacesQueryVariables>(GetAllPlacesDocument, options);
}
export function useGetAllPlacesSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllPlacesQuery, GetAllPlacesQueryVariables>,
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetAllPlacesQuery, GetAllPlacesQueryVariables>(GetAllPlacesDocument, options);
}
export type GetAllPlacesQueryHookResult = ReturnType<typeof useGetAllPlacesQuery>;
export type GetAllPlacesLazyQueryHookResult = ReturnType<typeof useGetAllPlacesLazyQuery>;
export type GetAllPlacesSuspenseQueryHookResult = ReturnType<typeof useGetAllPlacesSuspenseQuery>;
export type GetAllPlacesQueryResult = Apollo.QueryResult<GetAllPlacesQuery, GetAllPlacesQueryVariables>;
export const ToggleFavoriteDocument = gql`
  mutation ToggleFavorite($placeId: ID!) {
    toggleFavorite(placeId: $placeId)
  }
`;
export type ToggleFavoriteMutationFn = Apollo.MutationFunction<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>;

/**
 * __useToggleFavoriteMutation__
 *
 * To run a mutation, you first call `useToggleFavoriteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleFavoriteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleFavoriteMutation, { data, loading, error }] = useToggleFavoriteMutation({
 *   variables: {
 *      placeId: // value for 'placeId'
 *   },
 * });
 */
export function useToggleFavoriteMutation(
  baseOptions?: Apollo.MutationHookOptions<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ToggleFavoriteMutation, ToggleFavoriteMutationVariables>(ToggleFavoriteDocument, options);
}
export type ToggleFavoriteMutationHookResult = ReturnType<typeof useToggleFavoriteMutation>;
export type ToggleFavoriteMutationResult = Apollo.MutationResult<ToggleFavoriteMutation>;
export type ToggleFavoriteMutationOptions = Apollo.BaseMutationOptions<
  ToggleFavoriteMutation,
  ToggleFavoriteMutationVariables
>;
export const ToggleCharacteristicDocument = gql`
  mutation ToggleCharacteristic($placeId: ID!, $characteristic: Characteristic!) {
    toggleCharacteristic(placeId: $placeId, characteristic: $characteristic) {
      success
    }
  }
`;
export type ToggleCharacteristicMutationFn = Apollo.MutationFunction<
  ToggleCharacteristicMutation,
  ToggleCharacteristicMutationVariables
>;

/**
 * __useToggleCharacteristicMutation__
 *
 * To run a mutation, you first call `useToggleCharacteristicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleCharacteristicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleCharacteristicMutation, { data, loading, error }] = useToggleCharacteristicMutation({
 *   variables: {
 *      placeId: // value for 'placeId'
 *      characteristic: // value for 'characteristic'
 *   },
 * });
 */
export function useToggleCharacteristicMutation(
  baseOptions?: Apollo.MutationHookOptions<ToggleCharacteristicMutation, ToggleCharacteristicMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ToggleCharacteristicMutation, ToggleCharacteristicMutationVariables>(
    ToggleCharacteristicDocument,
    options,
  );
}
export type ToggleCharacteristicMutationHookResult = ReturnType<typeof useToggleCharacteristicMutation>;
export type ToggleCharacteristicMutationResult = Apollo.MutationResult<ToggleCharacteristicMutation>;
export type ToggleCharacteristicMutationOptions = Apollo.BaseMutationOptions<
  ToggleCharacteristicMutation,
  ToggleCharacteristicMutationVariables
>;
export const AddRatingDocument = gql`
  mutation AddRating($placeId: ID!, $rating: Float!) {
    addRating(placeId: $placeId, rating: $rating) {
      averageRating
      ratingCount
      reviewId
      userRating
    }
  }
`;
export type AddRatingMutationFn = Apollo.MutationFunction<AddRatingMutation, AddRatingMutationVariables>;

/**
 * __useAddRatingMutation__
 *
 * To run a mutation, you first call `useAddRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addRatingMutation, { data, loading, error }] = useAddRatingMutation({
 *   variables: {
 *      placeId: // value for 'placeId'
 *      rating: // value for 'rating'
 *   },
 * });
 */
export function useAddRatingMutation(
  baseOptions?: Apollo.MutationHookOptions<AddRatingMutation, AddRatingMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddRatingMutation, AddRatingMutationVariables>(AddRatingDocument, options);
}
export type AddRatingMutationHookResult = ReturnType<typeof useAddRatingMutation>;
export type AddRatingMutationResult = Apollo.MutationResult<AddRatingMutation>;
export type AddRatingMutationOptions = Apollo.BaseMutationOptions<AddRatingMutation, AddRatingMutationVariables>;
export const AddTextReviewDocument = gql`
  mutation AddTextReview($placeId: ID!, $text: String!) {
    addTextReview(placeId: $placeId, text: $text) {
      reviewId
      text
    }
  }
`;
export type AddTextReviewMutationFn = Apollo.MutationFunction<AddTextReviewMutation, AddTextReviewMutationVariables>;

/**
 * __useAddTextReviewMutation__
 *
 * To run a mutation, you first call `useAddTextReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTextReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTextReviewMutation, { data, loading, error }] = useAddTextReviewMutation({
 *   variables: {
 *      placeId: // value for 'placeId'
 *      text: // value for 'text'
 *   },
 * });
 */
export function useAddTextReviewMutation(
  baseOptions?: Apollo.MutationHookOptions<AddTextReviewMutation, AddTextReviewMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<AddTextReviewMutation, AddTextReviewMutationVariables>(AddTextReviewDocument, options);
}
export type AddTextReviewMutationHookResult = ReturnType<typeof useAddTextReviewMutation>;
export type AddTextReviewMutationResult = Apollo.MutationResult<AddTextReviewMutation>;
export type AddTextReviewMutationOptions = Apollo.BaseMutationOptions<
  AddTextReviewMutation,
  AddTextReviewMutationVariables
>;
export const DeleteReviewDocument = gql`
  mutation DeleteReview($reviewId: ID!, $deleteOptions: String!) {
    deleteReview(reviewId: $reviewId, deleteOptions: $deleteOptions) {
      reviewId
      averageRating
      ratingCount
    }
  }
`;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      reviewId: // value for 'reviewId'
 *      deleteOptions: // value for 'deleteOptions'
 *   },
 * });
 */
export function useDeleteReviewMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, options);
}
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<
  DeleteReviewMutation,
  DeleteReviewMutationVariables
>;
export const PlaceReviewsDocument = gql`
  query PlaceReviews($placeId: ID!) {
    placeReviews(placeId: $placeId) {
      id
      reviews {
        id
        text
        userId
        userName
        userAvatar
        createdAt
        userRating
        isOwnReview
      }
    }
  }
`;

/**
 * __usePlaceReviewsQuery__
 *
 * To run a query within a React component, call `usePlaceReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaceReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaceReviewsQuery({
 *   variables: {
 *      placeId: // value for 'placeId'
 *   },
 * });
 */
export function usePlaceReviewsQuery(
  baseOptions: Apollo.QueryHookOptions<PlaceReviewsQuery, PlaceReviewsQueryVariables> &
    ({ variables: PlaceReviewsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<PlaceReviewsQuery, PlaceReviewsQueryVariables>(PlaceReviewsDocument, options);
}
export function usePlaceReviewsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<PlaceReviewsQuery, PlaceReviewsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<PlaceReviewsQuery, PlaceReviewsQueryVariables>(PlaceReviewsDocument, options);
}
export function usePlaceReviewsSuspenseQuery(
  baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PlaceReviewsQuery, PlaceReviewsQueryVariables>,
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<PlaceReviewsQuery, PlaceReviewsQueryVariables>(PlaceReviewsDocument, options);
}
export type PlaceReviewsQueryHookResult = ReturnType<typeof usePlaceReviewsQuery>;
export type PlaceReviewsLazyQueryHookResult = ReturnType<typeof usePlaceReviewsLazyQuery>;
export type PlaceReviewsSuspenseQueryHookResult = ReturnType<typeof usePlaceReviewsSuspenseQuery>;
export type PlaceReviewsQueryResult = Apollo.QueryResult<PlaceReviewsQuery, PlaceReviewsQueryVariables>;
export const GetUserReviewActivityDocument = gql`
  query getUserReviewActivity {
    getUserReviewActivity {
      rating
      reviewText
      placeId
      placeName
      averageRating
      createdAt
    }
  }
`;

/**
 * __useGetUserReviewActivityQuery__
 *
 * To run a query within a React component, call `useGetUserReviewActivityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserReviewActivityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserReviewActivityQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserReviewActivityQuery(
  baseOptions?: Apollo.QueryHookOptions<GetUserReviewActivityQuery, GetUserReviewActivityQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserReviewActivityQuery, GetUserReviewActivityQueryVariables>(
    GetUserReviewActivityDocument,
    options,
  );
}
export function useGetUserReviewActivityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetUserReviewActivityQuery, GetUserReviewActivityQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserReviewActivityQuery, GetUserReviewActivityQueryVariables>(
    GetUserReviewActivityDocument,
    options,
  );
}
export function useGetUserReviewActivitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetUserReviewActivityQuery, GetUserReviewActivityQueryVariables>,
) {
  const options = baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUserReviewActivityQuery, GetUserReviewActivityQueryVariables>(
    GetUserReviewActivityDocument,
    options,
  );
}
export type GetUserReviewActivityQueryHookResult = ReturnType<typeof useGetUserReviewActivityQuery>;
export type GetUserReviewActivityLazyQueryHookResult = ReturnType<typeof useGetUserReviewActivityLazyQuery>;
export type GetUserReviewActivitySuspenseQueryHookResult = ReturnType<typeof useGetUserReviewActivitySuspenseQuery>;
export type GetUserReviewActivityQueryResult = Apollo.QueryResult<
  GetUserReviewActivityQuery,
  GetUserReviewActivityQueryVariables
>;
export const UploadAvatarDocument = gql`
  mutation UploadAvatar($userId: ID!, $fileUrl: String!) {
    uploadAvatar(userId: $userId, fileUrl: $fileUrl) {
      success
    }
  }
`;
export type UploadAvatarMutationFn = Apollo.MutationFunction<UploadAvatarMutation, UploadAvatarMutationVariables>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      fileUrl: // value for 'fileUrl'
 *   },
 * });
 */
export function useUploadAvatarMutation(
  baseOptions?: Apollo.MutationHookOptions<UploadAvatarMutation, UploadAvatarMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(UploadAvatarDocument, options);
}
export type UploadAvatarMutationHookResult = ReturnType<typeof useUploadAvatarMutation>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<
  UploadAvatarMutation,
  UploadAvatarMutationVariables
>;
export const DeleteAvatarDocument = gql`
  mutation DeleteAvatar {
    deleteAvatar {
      success
    }
  }
`;
export type DeleteAvatarMutationFn = Apollo.MutationFunction<DeleteAvatarMutation, DeleteAvatarMutationVariables>;

/**
 * __useDeleteAvatarMutation__
 *
 * To run a mutation, you first call `useDeleteAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAvatarMutation, { data, loading, error }] = useDeleteAvatarMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteAvatarMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteAvatarMutation, DeleteAvatarMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<DeleteAvatarMutation, DeleteAvatarMutationVariables>(DeleteAvatarDocument, options);
}
export type DeleteAvatarMutationHookResult = ReturnType<typeof useDeleteAvatarMutation>;
export type DeleteAvatarMutationResult = Apollo.MutationResult<DeleteAvatarMutation>;
export type DeleteAvatarMutationOptions = Apollo.BaseMutationOptions<
  DeleteAvatarMutation,
  DeleteAvatarMutationVariables
>;
