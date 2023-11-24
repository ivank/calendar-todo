import { apiEmpty as api } from './api.empty';
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getWellKnownHealthCheck: build.query<GetWellKnownHealthCheckApiResponse, GetWellKnownHealthCheckApiArg>({
      query: () => ({ url: `/.well-known/health-check` }),
    }),
    getWellKnownOpenapiJson: build.query<GetWellKnownOpenapiJsonApiResponse, GetWellKnownOpenapiJsonApiArg>({
      query: () => ({ url: `/.well-known/openapi.json` }),
    }),
    postAuthRegistration: build.mutation<PostAuthRegistrationApiResponse, PostAuthRegistrationApiArg>({
      query: (queryArg) => ({ url: `/auth/registration`, method: 'POST', body: queryArg.body }),
    }),
    postAuthRegistrationVerification: build.mutation<
      PostAuthRegistrationVerificationApiResponse,
      PostAuthRegistrationVerificationApiArg
    >({
      query: (queryArg) => ({ url: `/auth/registration/verification`, method: 'POST', body: queryArg.body }),
    }),
    postAuthAuthentication: build.mutation<PostAuthAuthenticationApiResponse, PostAuthAuthenticationApiArg>({
      query: (queryArg) => ({ url: `/auth/authentication`, method: 'POST', body: queryArg.body }),
    }),
    postAuthAuthenticationVerification: build.mutation<
      PostAuthAuthenticationVerificationApiResponse,
      PostAuthAuthenticationVerificationApiArg
    >({
      query: (queryArg) => ({ url: `/auth/authentication/verification`, method: 'POST', body: queryArg.body }),
    }),
    getLists: build.query<GetListsApiResponse, GetListsApiArg>({
      query: (queryArg) => ({ url: `/lists/`, params: { from: queryArg['from'], to: queryArg.to } }),
    }),
    postLists: build.mutation<PostListsApiResponse, PostListsApiArg>({
      query: (queryArg) => ({ url: `/lists/`, method: 'POST', body: queryArg.body }),
    }),
    getListsById: build.query<GetListsByIdApiResponse, GetListsByIdApiArg>({
      query: (queryArg) => ({ url: `/lists/${queryArg.id}` }),
    }),
    patchListsById: build.mutation<PatchListsByIdApiResponse, PatchListsByIdApiArg>({
      query: (queryArg) => ({ url: `/lists/${queryArg.id}`, method: 'PATCH', body: queryArg.body }),
    }),
    deleteListsById: build.mutation<DeleteListsByIdApiResponse, DeleteListsByIdApiArg>({
      query: (queryArg) => ({ url: `/lists/${queryArg.id}`, method: 'DELETE' }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as apiGenerated };
export type GetWellKnownHealthCheckApiResponse = /** status 200 Default Response */ {
  healthy: boolean;
};
export type GetWellKnownHealthCheckApiArg = void;
export type GetWellKnownOpenapiJsonApiResponse = unknown;
export type GetWellKnownOpenapiJsonApiArg = void;
export type PostAuthRegistrationApiResponse = /** status 200 Default Response */ {
  id: number;
  response: {
    rp: {
      name: string;
      id?: string;
    };
    user: {
      id: string;
      name: string;
      displayName: string;
    };
    challenge: string;
    pubKeyCredParams: {
      alg: number;
      type: 'public-key';
    }[];
    timeout?: number;
    excludeCredentials?: {
      id: string;
      type: 'public-key';
      transports?: ('ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb')[];
    }[];
    authenticatorSelection?: {
      authenticatorAttachment?: 'cross-platform' | 'platform';
      requireResidentKey?: boolean;
      residentKey?: 'discouraged' | 'preferred' | 'required';
      userVerification?: 'discouraged' | 'preferred' | 'required';
    };
    attestation?: 'direct' | 'enterprise' | 'indirect' | 'none';
    extensions?: {
      appid?: string;
      credProps?: boolean;
      hmacCreateSecret?: boolean;
    };
  };
};
export type PostAuthRegistrationApiArg = {
  body: {
    email: string;
    name: string;
  };
};
export type PostAuthRegistrationVerificationApiResponse =
  /** status 200 Default Response */
  | {
      verified: true;
      auth: {
        token: string;
        name: string;
        email: string;
        id: number;
      };
    }
  | {
      verified: false;
    };
export type PostAuthRegistrationVerificationApiArg = {
  body: {
    id: number;
    response: {
      id: string;
      rawId: string;
      response: {
        clientDataJSON: string;
        attestationObject: string;
        authenticatorData?: string;
        transports?: ('ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb')[];
        publicKeyAlgorithm?: number;
        publicKey?: string;
      };
      authenticatorAttachment?: 'cross-platform' | 'platform';
      clientExtensionResults: {
        appid?: boolean;
        credProps?: {
          rk?: boolean;
        };
        hmacCreateSecret?: boolean;
      };
      type: 'public-key';
    };
  };
};
export type PostAuthAuthenticationApiResponse = /** status 200 Default Response */ {
  id: number;
  response: {
    challenge: string;
    timeout?: number;
    rpId?: string;
    allowCredentials?: {
      id: string;
      type: 'public-key';
      transports?: ('ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb')[];
    }[];
    userVerification?: 'discouraged' | 'preferred' | 'required';
    extensions?: {
      appid?: string;
      credProps?: boolean;
      hmacCreateSecret?: boolean;
    };
  };
};
export type PostAuthAuthenticationApiArg = {
  body: {
    email: string;
  };
};
export type PostAuthAuthenticationVerificationApiResponse =
  /** status 200 Default Response */
  | {
      verified: true;
      auth: {
        token: string;
        name: string;
        email: string;
        id: number;
      };
    }
  | {
      verified: false;
    };
export type PostAuthAuthenticationVerificationApiArg = {
  body: {
    id: number;
    response: {
      id: string;
      rawId: string;
      response: {
        clientDataJSON: string;
        authenticatorData: string;
        signature: string;
        userHandle?: string;
      };
      authenticatorAttachment?: 'cross-platform' | 'platform';
      clientExtensionResults: {
        appid?: boolean;
        credProps?: {
          rk?: boolean;
        };
        hmacCreateSecret?: boolean;
      };
      type: 'public-key';
    };
  };
};
export type GetListsApiResponse = /** status 200 Default Response */ (
  | {
      position: number;
      type: 'DAY';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    }
  | {
      title: string;
      position: number;
      type: 'NAMED';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    }
)[];
export type GetListsApiArg = {
  from: number;
  to: number;
};
export type PostListsApiResponse =
  /** status 200 Default Response */
  | {
      position: number;
      type: 'DAY';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    }
  | {
      title: string;
      position: number;
      type: 'NAMED';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    };
export type PostListsApiArg = {
  body:
    | {
        position: number;
        type: 'DAY';
        items: {
          done: boolean;
          text: string;
        }[];
      }
    | {
        title: string;
        position: number;
        type: 'NAMED';
        items: {
          done: boolean;
          text: string;
        }[];
      };
};
export type GetListsByIdApiResponse =
  /** status 200 Default Response */
  | {
      position: number;
      type: 'DAY';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    }
  | {
      title: string;
      position: number;
      type: 'NAMED';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    };
export type GetListsByIdApiArg = {
  id: number;
};
export type PatchListsByIdApiResponse =
  /** status 200 Default Response */
  | {
      position: number;
      type: 'DAY';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    }
  | {
      title: string;
      position: number;
      type: 'NAMED';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    };
export type PatchListsByIdApiArg = {
  id: number;
  body:
    | {
        position: number;
        type: 'DAY';
        items: {
          done: boolean;
          text: string;
        }[];
      }
    | {
        title: string;
        position: number;
        type: 'NAMED';
        items: {
          done: boolean;
          text: string;
        }[];
      };
};
export type DeleteListsByIdApiResponse =
  /** status 200 Default Response */
  | {
      position: number;
      type: 'DAY';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    }
  | {
      title: string;
      position: number;
      type: 'NAMED';
      items: {
        done: boolean;
        text: string;
      }[];
      id: number;
    };
export type DeleteListsByIdApiArg = {
  id: number;
};
export const {
  useGetWellKnownHealthCheckQuery,
  useGetWellKnownOpenapiJsonQuery,
  usePostAuthRegistrationMutation,
  usePostAuthRegistrationVerificationMutation,
  usePostAuthAuthenticationMutation,
  usePostAuthAuthenticationVerificationMutation,
  useGetListsQuery,
  usePostListsMutation,
  useGetListsByIdQuery,
  usePatchListsByIdMutation,
  useDeleteListsByIdMutation,
} = injectedRtkApi;
