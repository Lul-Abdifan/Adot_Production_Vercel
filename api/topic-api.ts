 import { Topic, TopicContainer, ApproveTopicResponse, GetTopicsResponse } from '@/types/topic';
import adotApi from ".";


export const topicSlice = adotApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopics: builder.query<GetTopicsResponse, void>({
      query: () => {
        return{  
          url: "/v1/admin/topics",
          method: "GET",
        }
      },
      providesTags: ['Topics'],
    }),
    getAllTopics: builder.query<TopicContainer, void>({
      query: () => {
      return{  
        url: "/v1/admin/topicsWithInsight",
        method: "GET",
      }
      },
      
      providesTags: ['Topics'],
    }),
    getSortedTopics: builder.query<{ data: { topics: Topic[], count: number } }, any>({
      query: ({page, limit, sortBy, sortOrder, isArchived, keyword}) => {
        return {
          url: `/v1/admin/sorted-topics?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isArchived=${isArchived}&keyword=${keyword}`,
          method: "GET",
        }
      },
      providesTags: ['Topics'],
    }),
    getTopicById: builder.query<{ data: Topic}, string>({
      query: (id) => {
        return {
          url: `/v1/admin/topics/${id}`,
          method: "GET",
        }
      },
      providesTags: ['Topics'],
    }),
    addTopic: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => {
        return {
          url: '/v1/admin/topics/create',
          method: 'POST',
          body: data,
          formData: true
        };
      },
      invalidatesTags: ['Topics','Categories'],
    }),
    updateTopic: builder.mutation<any, { data: FormData, id: string }>({
      query: ({ data, id }) => {
        return {
          url: `/v1/admin/topics/${id}`,
          method: 'PUT',
          body: data,
          formData: true
        };
      },
      invalidatesTags: ['Topics','Categories'],
    }),
    archiveTopic: builder.mutation<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/archiveTopic/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Topics','Categories'],
    }),
    unarchiveTopic: builder.mutation<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/unarchiveTopic/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Topics','Categories'],
    }),
    searchTopic: builder.query<{ data: Topic[] }, any>({
      query: ({userQuery}) => {
        return {
          url: `/v1/admin/topics/search?query=${userQuery}`,
          method: "GET",
        }
      },
      providesTags: ['Topics'],
    }),
     approveTopic: builder.mutation<ApproveTopicResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/topic/approve/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Topics','Categories'],
    }),
  }),
});

export const {useGetTopicsQuery, useGetAllTopicsQuery, useAddTopicMutation, useGetSortedTopicsQuery, useGetTopicByIdQuery, useUpdateTopicMutation, useArchiveTopicMutation, useUnarchiveTopicMutation, useSearchTopicQuery, useApproveTopicMutation} = topicSlice;