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
    getNamedLists: build.query<GetNamedListsApiResponse, GetNamedListsApiArg>({
      query: () => ({ url: `/named-lists/` }),
    }),
    postNamedLists: build.mutation<PostNamedListsApiResponse, PostNamedListsApiArg>({
      query: (queryArg) => ({ url: `/named-lists/`, method: 'POST', body: queryArg.body }),
    }),
    getNamedListsById: build.query<GetNamedListsByIdApiResponse, GetNamedListsByIdApiArg>({
      query: (queryArg) => ({ url: `/named-lists/${queryArg.id}` }),
    }),
    patchNamedListsById: build.mutation<PatchNamedListsByIdApiResponse, PatchNamedListsByIdApiArg>({
      query: (queryArg) => ({ url: `/named-lists/${queryArg.id}`, method: 'PATCH', body: queryArg.body }),
    }),
    deleteNamedListsById: build.mutation<DeleteNamedListsByIdApiResponse, DeleteNamedListsByIdApiArg>({
      query: (queryArg) => ({ url: `/named-lists/${queryArg.id}`, method: 'DELETE' }),
    }),
    getDayLists: build.query<GetDayListsApiResponse, GetDayListsApiArg>({
      query: (queryArg) => ({ url: `/day-lists/`, params: { from: queryArg['from'], to: queryArg.to } }),
    }),
    postDayLists: build.mutation<PostDayListsApiResponse, PostDayListsApiArg>({
      query: (queryArg) => ({ url: `/day-lists/`, method: 'POST', body: queryArg.body }),
    }),
    getDayListsById: build.query<GetDayListsByIdApiResponse, GetDayListsByIdApiArg>({
      query: (queryArg) => ({ url: `/day-lists/${queryArg.id}` }),
    }),
    patchDayListsById: build.mutation<PatchDayListsByIdApiResponse, PatchDayListsByIdApiArg>({
      query: (queryArg) => ({ url: `/day-lists/${queryArg.id}`, method: 'PATCH', body: queryArg.body }),
    }),
    deleteDayListsById: build.mutation<DeleteDayListsByIdApiResponse, DeleteDayListsByIdApiArg>({
      query: (queryArg) => ({ url: `/day-lists/${queryArg.id}`, method: 'DELETE' }),
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
      token: string;
      name: string;
      email: string;
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
      token: string;
      name: string;
      email: string;
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
export type GetNamedListsApiResponse = /** status 200 Default Response */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
}[];
export type GetNamedListsApiArg = void;
export type PostNamedListsApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PostNamedListsApiArg = {
  body: {
    orderBy: number;
    title: string;
    items: {
      done: boolean;
      text: string;
    }[];
  };
};
export type GetNamedListsByIdApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type GetNamedListsByIdApiArg = {
  id: number;
};
export type PatchNamedListsByIdApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PatchNamedListsByIdApiArg = {
  id: number;
  body: {
    title: string;
    items: {
      done: boolean;
      text: string;
    }[];
  };
};
export type DeleteNamedListsByIdApiResponse = /** status 200 TodoNamedList */ {
  title: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type DeleteNamedListsByIdApiArg = {
  id: number;
};
export type GetDayListsApiResponse = /** status 200 Default Response */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
}[];
export type GetDayListsApiArg = {
  from: string;
  to: string;
};
export type PostDayListsApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PostDayListsApiArg = {
  body: {
    day: string;
    items: {
      done: boolean;
      text: string;
    }[];
  };
};
export type GetDayListsByIdApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type GetDayListsByIdApiArg = {
  id: number;
};
export type PatchDayListsByIdApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type PatchDayListsByIdApiArg = {
  id: number;
  body: {
    day: string;
    items: {
      done: boolean;
      text: string;
    }[];
  };
};
export type DeleteDayListsByIdApiResponse = /** status 200 TodoDayList */ {
  day: string;
  items: {
    done: boolean;
    text: string;
  }[];
  id: number;
};
export type DeleteDayListsByIdApiArg = {
  id: number;
};
export const {
  useGetWellKnownHealthCheckQuery,
  useGetWellKnownOpenapiJsonQuery,
  usePostAuthRegistrationMutation,
  usePostAuthRegistrationVerificationMutation,
  usePostAuthAuthenticationMutation,
  usePostAuthAuthenticationVerificationMutation,
  useGetNamedListsQuery,
  usePostNamedListsMutation,
  useGetNamedListsByIdQuery,
  usePatchNamedListsByIdMutation,
  useDeleteNamedListsByIdMutation,
  useGetDayListsQuery,
  usePostDayListsMutation,
  useGetDayListsByIdQuery,
  usePatchDayListsByIdMutation,
  useDeleteDayListsByIdMutation,
} = injectedRtkApi;
