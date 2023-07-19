import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type FrequencyInput = {
  frequency: Scalars['Float'];
  urlId: Scalars['Float'];
};

export type LatencyTresholdInput = {
  threshold: Scalars['Float'];
  urlId: Scalars['Float'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createUrl: Url;
  createUser: User;
  login: Scalars['String'];
  logout: Scalars['String'];
  updateFrequency: UserToUrl;
  updateLatencyTreshold: UserToUrl;
};


export type MutationCreateUrlArgs = {
  url: CreateUrlInput;
};


export type MutationCreateUserArgs = {
  data: UserInput;
};


export type MutationLoginArgs = {
  data: UserInputLogin;
};


export type MutationUpdateFrequencyArgs = {
  data: FrequencyInput;
};


export type MutationUpdateLatencyTresholdArgs = {
  data: LatencyTresholdInput;
};

export type Query = {
  __typename?: 'Query';
  getUrlById: Url;
  getUrls: Array<Url>;
  getUrlsByUserId: User;
  profile: User;
};


export type QueryGetUrlByIdArgs = {
  urlId: Scalars['Float'];
};

export type Response = {
  __typename?: 'Response';
  created_at: Scalars['DateTime'];
  id: Scalars['Float'];
  latency: Scalars['Float'];
  response_status: Scalars['Float'];
};

export type Url = {
  __typename?: 'Url';
  created_at: Scalars['DateTime'];
  frequency: Scalars['Float'];
  id: Scalars['Float'];
  responses: Array<Response>;
  url: Scalars['String'];
  userToUrls: Array<UserToUrl>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['Float'];
  last_connection: Scalars['DateTime'];
  role: Scalars['String'];
  userToUrls: Array<UserToUrl>;
  username: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserInputLogin = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserToUrl = {
  __typename?: 'UserToUrl';
  frequency: Scalars['Float'];
  latency_threshold: Scalars['Float'];
  url: Url;
  user: User;
};

export type CreateUrlInput = {
  url: Scalars['String'];
};

export type CreateUrlMutationVariables = Exact<{
  url: CreateUrlInput;
}>;


export type CreateUrlMutation = { __typename?: 'Mutation', createUrl: { __typename?: 'Url', created_at: any, id: number, url: string, responses: Array<{ __typename?: 'Response', response_status: number, latency: number, id: number, created_at: any }> } };

export type CreateUserMutationVariables = Exact<{
  data: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: number, username: string } };

export type GetUrlsByUserIdQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUrlsByUserIdQuery = { __typename?: 'Query', getUrlsByUserId: { __typename?: 'User', id: number, username: string, email: string, role: string, userToUrls: Array<{ __typename?: 'UserToUrl', frequency: number, latency_threshold: number, url: { __typename?: 'Url', id: number, url: string, created_at: any, responses: Array<{ __typename?: 'Response', id: number, response_status: number, latency: number, created_at: any }> } }> } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', profile: { __typename?: 'User', id: number, username: string, email: string, role: string, last_connection: any } };

export type GetUrlByIdQueryVariables = Exact<{
  urlId: Scalars['Float'];
}>;


export type GetUrlByIdQuery = { __typename?: 'Query', getUrlById: { __typename?: 'Url', url: string, id: number, created_at: any, frequency: number, responses: Array<{ __typename?: 'Response', response_status: number, latency: number, id: number, created_at: any }> } };

export type GetUrlsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUrlsQuery = { __typename?: 'Query', getUrls: Array<{ __typename?: 'Url', created_at: any, id: number, url: string, responses: Array<{ __typename?: 'Response', response_status: number, latency: number, id: number, created_at: any }> }> };

export type LoginMutationVariables = Exact<{
  data: UserInputLogin;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: string };

export type UpdateFrequencyMutationVariables = Exact<{
  data: FrequencyInput;
}>;


export type UpdateFrequencyMutation = { __typename?: 'Mutation', updateFrequency: { __typename?: 'UserToUrl', frequency: number } };

export type UpdateLatencyTresholdMutationVariables = Exact<{
  data: LatencyTresholdInput;
}>;


export type UpdateLatencyTresholdMutation = { __typename?: 'Mutation', updateLatencyTreshold: { __typename?: 'UserToUrl', latency_threshold: number } };


export const CreateUrlDocument = gql`
    mutation createUrl($url: createUrlInput!) {
  createUrl(url: $url) {
    created_at
    id
    url
    responses {
      response_status
      latency
      id
      created_at
    }
  }
}
    `;
export type CreateUrlMutationFn = Apollo.MutationFunction<CreateUrlMutation, CreateUrlMutationVariables>;

/**
 * __useCreateUrlMutation__
 *
 * To run a mutation, you first call `useCreateUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUrlMutation, { data, loading, error }] = useCreateUrlMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useCreateUrlMutation(baseOptions?: Apollo.MutationHookOptions<CreateUrlMutation, CreateUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUrlMutation, CreateUrlMutationVariables>(CreateUrlDocument, options);
      }
export type CreateUrlMutationHookResult = ReturnType<typeof useCreateUrlMutation>;
export type CreateUrlMutationResult = Apollo.MutationResult<CreateUrlMutation>;
export type CreateUrlMutationOptions = Apollo.BaseMutationOptions<CreateUrlMutation, CreateUrlMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: UserInput!) {
  createUser(data: $data) {
    id
    username
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const GetUrlsByUserIdDocument = gql`
    query GetUrlsByUserId {
  getUrlsByUserId {
    id
    username
    email
    role
    userToUrls {
      frequency
      latency_threshold
      url {
        id
        url
        created_at
        responses {
          id
          response_status
          latency
          created_at
        }
      }
    }
  }
}
    `;

/**
 * __useGetUrlsByUserIdQuery__
 *
 * To run a query within a React component, call `useGetUrlsByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUrlsByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUrlsByUserIdQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUrlsByUserIdQuery(baseOptions?: Apollo.QueryHookOptions<GetUrlsByUserIdQuery, GetUrlsByUserIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUrlsByUserIdQuery, GetUrlsByUserIdQueryVariables>(GetUrlsByUserIdDocument, options);
      }
export function useGetUrlsByUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUrlsByUserIdQuery, GetUrlsByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUrlsByUserIdQuery, GetUrlsByUserIdQueryVariables>(GetUrlsByUserIdDocument, options);
        }
export type GetUrlsByUserIdQueryHookResult = ReturnType<typeof useGetUrlsByUserIdQuery>;
export type GetUrlsByUserIdLazyQueryHookResult = ReturnType<typeof useGetUrlsByUserIdLazyQuery>;
export type GetUrlsByUserIdQueryResult = Apollo.QueryResult<GetUrlsByUserIdQuery, GetUrlsByUserIdQueryVariables>;
export const GetProfileDocument = gql`
    query GetProfile {
  profile {
    id
    username
    email
    role
    last_connection
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const GetUrlByIdDocument = gql`
    query GetUrlById($urlId: Float!) {
  getUrlById(urlId: $urlId) {
    url
    id
    created_at
    frequency
    responses {
      response_status
      latency
      id
      created_at
    }
  }
}
    `;

/**
 * __useGetUrlByIdQuery__
 *
 * To run a query within a React component, call `useGetUrlByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUrlByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUrlByIdQuery({
 *   variables: {
 *      urlId: // value for 'urlId'
 *   },
 * });
 */
export function useGetUrlByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUrlByIdQuery, GetUrlByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUrlByIdQuery, GetUrlByIdQueryVariables>(GetUrlByIdDocument, options);
      }
export function useGetUrlByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUrlByIdQuery, GetUrlByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUrlByIdQuery, GetUrlByIdQueryVariables>(GetUrlByIdDocument, options);
        }
export type GetUrlByIdQueryHookResult = ReturnType<typeof useGetUrlByIdQuery>;
export type GetUrlByIdLazyQueryHookResult = ReturnType<typeof useGetUrlByIdLazyQuery>;
export type GetUrlByIdQueryResult = Apollo.QueryResult<GetUrlByIdQuery, GetUrlByIdQueryVariables>;
export const GetUrlsDocument = gql`
    query GetUrls {
  getUrls {
    created_at
    id
    url
    responses {
      response_status
      latency
      id
      created_at
    }
  }
}
    `;

/**
 * __useGetUrlsQuery__
 *
 * To run a query within a React component, call `useGetUrlsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUrlsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUrlsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUrlsQuery(baseOptions?: Apollo.QueryHookOptions<GetUrlsQuery, GetUrlsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUrlsQuery, GetUrlsQueryVariables>(GetUrlsDocument, options);
      }
export function useGetUrlsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUrlsQuery, GetUrlsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUrlsQuery, GetUrlsQueryVariables>(GetUrlsDocument, options);
        }
export type GetUrlsQueryHookResult = ReturnType<typeof useGetUrlsQuery>;
export type GetUrlsLazyQueryHookResult = ReturnType<typeof useGetUrlsLazyQuery>;
export type GetUrlsQueryResult = Apollo.QueryResult<GetUrlsQuery, GetUrlsQueryVariables>;
export const LoginDocument = gql`
    mutation Login($data: UserInputLogin!) {
  login(data: $data)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
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
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const UpdateFrequencyDocument = gql`
    mutation UpdateFrequency($data: FrequencyInput!) {
  updateFrequency(data: $data) {
    frequency
  }
}
    `;
export type UpdateFrequencyMutationFn = Apollo.MutationFunction<UpdateFrequencyMutation, UpdateFrequencyMutationVariables>;

/**
 * __useUpdateFrequencyMutation__
 *
 * To run a mutation, you first call `useUpdateFrequencyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFrequencyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFrequencyMutation, { data, loading, error }] = useUpdateFrequencyMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateFrequencyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFrequencyMutation, UpdateFrequencyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFrequencyMutation, UpdateFrequencyMutationVariables>(UpdateFrequencyDocument, options);
      }
export type UpdateFrequencyMutationHookResult = ReturnType<typeof useUpdateFrequencyMutation>;
export type UpdateFrequencyMutationResult = Apollo.MutationResult<UpdateFrequencyMutation>;
export type UpdateFrequencyMutationOptions = Apollo.BaseMutationOptions<UpdateFrequencyMutation, UpdateFrequencyMutationVariables>;
export const UpdateLatencyTresholdDocument = gql`
    mutation updateLatencyTreshold($data: LatencyTresholdInput!) {
  updateLatencyTreshold(data: $data) {
    latency_threshold
  }
}
    `;
export type UpdateLatencyTresholdMutationFn = Apollo.MutationFunction<UpdateLatencyTresholdMutation, UpdateLatencyTresholdMutationVariables>;

/**
 * __useUpdateLatencyTresholdMutation__
 *
 * To run a mutation, you first call `useUpdateLatencyTresholdMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLatencyTresholdMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLatencyTresholdMutation, { data, loading, error }] = useUpdateLatencyTresholdMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateLatencyTresholdMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLatencyTresholdMutation, UpdateLatencyTresholdMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLatencyTresholdMutation, UpdateLatencyTresholdMutationVariables>(UpdateLatencyTresholdDocument, options);
      }
export type UpdateLatencyTresholdMutationHookResult = ReturnType<typeof useUpdateLatencyTresholdMutation>;
export type UpdateLatencyTresholdMutationResult = Apollo.MutationResult<UpdateLatencyTresholdMutation>;
export type UpdateLatencyTresholdMutationOptions = Apollo.BaseMutationOptions<UpdateLatencyTresholdMutation, UpdateLatencyTresholdMutationVariables>;