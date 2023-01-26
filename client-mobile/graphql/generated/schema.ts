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

export type Mutation = {
  __typename?: 'Mutation';
  createUrl: Url;
};


export type MutationCreateUrlArgs = {
  url: CreateUrlInput;
};

export type Query = {
  __typename?: 'Query';
  getUrlById: Url;
  getUrls: Array<Url>;
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
  id: Scalars['Float'];
  responses: Array<Response>;
  url: Scalars['String'];
};

export type CreateUrlInput = {
  url: Scalars['String'];
};

export type CreateUrlMutationVariables = Exact<{
  url: CreateUrlInput;
}>;


export type CreateUrlMutation = { __typename?: 'Mutation', createUrl: { __typename?: 'Url', created_at: any, id: number, url: string, responses: Array<{ __typename?: 'Response', response_status: number, latency: number, id: number, created_at: any }> } };

export type GetUrlByIdQueryVariables = Exact<{
  urlId: Scalars['Float'];
}>;


export type GetUrlByIdQuery = { __typename?: 'Query', getUrlById: { __typename?: 'Url', url: string, id: number, created_at: any, responses: Array<{ __typename?: 'Response', response_status: number, latency: number, id: number, created_at: any }> } };

export type GetUrlsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUrlsQuery = { __typename?: 'Query', getUrls: Array<{ __typename?: 'Url', created_at: any, id: number, url: string, responses: Array<{ __typename?: 'Response', response_status: number, latency: number, id: number, created_at: any }> }> };


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
export const GetUrlByIdDocument = gql`
    query GetUrlById($urlId: Float!) {
  getUrlById(urlId: $urlId) {
    url
    id
    created_at
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