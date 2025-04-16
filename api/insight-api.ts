import { Insight, InsightContainer, ApproveInsightResponse } from "@/types/insight";
import adotApi from ".";

export const insightSlice = adotApi.injectEndpoints({

  endpoints: (builder) => ({
    getAllInsights: builder.query<InsightContainer, void>({
      query: () => ({
        url: "/v1/admin/insights",
        method: "GET",
      }),
      providesTags: ["Insights"],
    }),
    addInsight: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => {
        return {
          url: "/v1/admin/insights/create",
          method: "POST",
          body: data,
          formData: true,
        };
      },
      invalidatesTags: ["Insights","Topics"],
    }),
    getInsight: builder.query<{ data: {insight: Insight}}, string>({
      query: (id) => ({
        url: `/v1/admin/insights/${id}`,
        method: "GET",
      }),
    }),
    editInsight:builder.mutation<any,{data:FormData, id:string}>({
      query:({id,data})=>{
        return {
          url:`/v1/admin/insights/${id}`,
          method:'PUT',
          body:data,
          formData:true
        }
      },
      invalidatesTags:['Insights',"Topics"]
    }),
    getSortedInsights: builder.query<{ data: {insights: Insight[], count: number} }, any>({
      query: ({page, limit, sortBy, sortOrder, isArchived, keyword}) => {
        return {
          url: `/v1/admin/sorted-insights?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&keyword=${keyword}&isArchived=${isArchived}`,
          method: "GET",
        }
      },
      providesTags: ['Insights'],
    }),
    archiveInsight: builder.mutation<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/archiveInsight/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Insights',"Topics"],
    }),
    unarchiveInsight: builder.mutation<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/unarchiveInsight/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Insights',"Topics"],
    }),
    searchInsight: builder.query<{ data: Insight[]}, any>({
      query: (userQuery) => ({
        url: `/v1/admin/insights/search?query=${userQuery}`,
        method: "GET",
      }),
    }),
     approveInsight: builder.mutation<ApproveInsightResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/insight/approve/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Insights',"Topics"],
    }),
  }),
});

export const { useGetAllInsightsQuery, useAddInsightMutation ,useGetInsightQuery, useEditInsightMutation, useGetSortedInsightsQuery, useArchiveInsightMutation, useUnarchiveInsightMutation, useSearchInsightQuery, useApproveInsightMutation} = insightSlice;
