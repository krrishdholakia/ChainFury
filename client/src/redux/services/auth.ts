import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL, DEFAULT_RESPONSE } from '../../constants';
import { RootState } from '../store';

interface LoginRequest {
  username: string;
  password: string;
}

let token: string | null = null;
export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      token = (getState() as RootState)?.auth?.accessToken;
      headers.set('content-type', 'application/json;charset=UTF-8');
      if (token) {
        headers.set('token', `${token}`);
      }
      return headers;
    },
    credentials: 'omit'
  }),
  endpoints: (builder) => ({
    login: builder.mutation<DEFAULT_RESPONSE, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials
      })
    }),
    signup: builder.mutation<
      DEFAULT_RESPONSE,
      {
        username: string;
        email: string;
        password: string;
      }
    >({
      query: (credentials) => ({
        url: '/signup',
        method: 'POST',
        body: credentials
      })
    }),
    changePassword: builder.mutation<
      DEFAULT_RESPONSE,
      {
        old_password: string;
        new_password: string;
      }
    >({
      query: (credentials) => ({
        url: '/user/change_password',
        method: 'POST',
        body: {
          old_password: credentials.old_password,
          new_password: credentials.new_password,
          username: ''
        }
      })
    }),
    addUserFeedBack: builder.mutation<
      DEFAULT_RESPONSE,
      {
        score: number;
        prompt_id: string;
      }
    >({
      query: ({ score, prompt_id }) => ({
        url: '/feedback?prompt_id=' + prompt_id,
        method: 'PUT',
        body: {
          score
        }
      })
    }),
    addInternalFeedBack: builder.mutation<
      DEFAULT_RESPONSE,
      {
        score: number;
        prompt_id: string;
        chatbot_id: string;
      }
    >({
      query: ({ score, prompt_id, chatbot_id }) => ({
        url: `/chatbot/${chatbot_id}/prompt?prompt_id=${prompt_id}`,
        method: 'PUT',
        body: {
          score
        }
      })
    }),
    processPrompt: builder.mutation<
      DEFAULT_RESPONSE,
      {
        chatbot_id: string;
        chat_history: string[];
        session_id: string;
        new_message: string;
      }
    >({
      query: ({
        chatbot_id,
        chat_history,
        session_id,
        new_message
      }: {
        chatbot_id: string;
        chat_history: string[];
        session_id: string;
        new_message: string;
      }) => ({
        url: `/chatbot/${chatbot_id}/prompt`,
        method: 'POST',
        body: {
          chat_history,
          session_id,
          new_message
        }
      })
    }),
    components: builder.mutation<DEFAULT_RESPONSE, void>({
      query: () => ({
        url: '/flow/components',
        method: 'GET'
      })
    }),
    furyComponents: builder.mutation<DEFAULT_RESPONSE, void>({
      query: () => ({
        url: '/fury/',
        method: 'GET'
      })
    }),
    furyComponentDetails: builder.mutation<
      DEFAULT_RESPONSE,
      {
        component_type: string;
      }
    >({
      query: ({ component_type }) => ({
        url: `/fury/components/${component_type}`,
        method: 'GET'
      })
    }),
    getPrompts: builder.mutation<
      DEFAULT_RESPONSE,
      {
        token: string;
        id: string;
      }
    >({
      query: (credentials) => ({
        url: `/chatbot/${credentials?.id}/prompt?limit=100&offset=0`,
        method: 'GET'
      })
    }),
    getBots: builder.mutation<
      DEFAULT_RESPONSE,
      {
        token: string;
      }
    >({
      query: (credentials) => ({
        url: '/chatbot/',
        method: 'GET'
      })
    }),
    getSteps: builder.mutation<
      DEFAULT_RESPONSE,
      {
        token: string;
        id: string;
        prompt_id: string;
      }
    >({
      query: ({ id, prompt_id }) => ({
        url: `/chatbot/${id}/prompt/${prompt_id}/intermediate_steps`,
        method: 'GET'
      })
    }),
    getTemplates: builder.mutation<
      DEFAULT_RESPONSE,
      {
        token: string;
      }
    >({
      query: () => ({
        url: `/template/`,
        method: 'GET'
      })
    }),
    getMetrics: builder.mutation<
      DEFAULT_RESPONSE,
      {
        token: string;
        id: string;
        metric_type: string;
      }
    >({
      query: ({ id, metric_type }) => ({
        url: `/chatbot/${id}/metrics?metric_type=${metric_type}`,
        method: 'GET'
      })
    }),
    getAllBotMetrics: builder.mutation<
      DEFAULT_RESPONSE,
      {
        token: string;
      }
    >({
      query: () => ({
        url: `/chatbot/metrics`,
        method: 'GET'
      })
    }),
    createBot: builder.mutation<
      DEFAULT_RESPONSE,
      {
        name: string;
        nodes: any;
        edges: any;
        token: string;
        engine: string;
        sample?: Record<string, any>;
        main_in?: string;
        main_out?: string;
      }
    >({
      query: (credentials) => ({
        url: '/chatbot/',
        method: 'POST',
        body: {
          engine: credentials.engine,
          name: credentials.name,
          dag: {
            nodes: credentials.nodes ?? [],
            edges: credentials.edges ?? [],
            sample: credentials.sample ?? undefined,
            main_in: credentials.main_in ?? undefined,
            main_out: credentials.main_out ?? undefined
          }
        }
      })
    }),
    editBot: builder.mutation<
      DEFAULT_RESPONSE,
      {
        name: string;
        nodes: any;
        edges: any;
        token: string;
        id: string;
        engine: string;
        sample?: Record<string, any>;
        main_in?: string;
        main_out?: string;
      }
    >({
      query: (credentials) => ({
        url: `/chatbot/${credentials?.id}`,
        method: 'PUT',
        body: {
          name: credentials.name,
          dag: {
            nodes: credentials.nodes ?? [],
            edges: credentials.edges ?? [],
            sample: credentials.sample ?? undefined,
            main_in: credentials.main_in ?? undefined,
            main_out: credentials.main_out ?? undefined
          },
          engine: credentials.engine,
          update_keys: ['dag']
        }
      })
    }),
    newAction: builder.mutation<
      DEFAULT_RESPONSE,
      {
        name: string;
        description: string;
        tags: [];
        fn: {
          model_id: string;
          model_params: {};
          fn: {};
        };
        outputs: [
          {
            type: string;
            name: string;
            loc: string;
          }
        ];
      }
    >({
      query: (credentials) => ({
        url: `/fury/actions/`,
        method: 'POST',
        body: credentials
      })
    }),
    getActions: builder.mutation<DEFAULT_RESPONSE, {}>({
      query: () => ({
        url: `/fury/actions/`,
        method: 'GET'
      })
    })
  })
});

export const {
  useLoginMutation,
  useSignupMutation,
  useComponentsMutation,
  useCreateBotMutation,
  useGetBotsMutation,
  useEditBotMutation,
  useGetPromptsMutation,
  useGetStepsMutation,
  useProcessPromptMutation,
  useGetMetricsMutation,
  useAddUserFeedBackMutation,
  useAddInternalFeedBackMutation,
  useGetTemplatesMutation,
  useChangePasswordMutation,
  useGetAllBotMetricsMutation,
  useFuryComponentsMutation,
  useFuryComponentDetailsMutation,
  useNewActionMutation,
  useGetActionsMutation
} = authApi;
