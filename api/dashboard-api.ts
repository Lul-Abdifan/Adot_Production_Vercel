import adotApi from ".";

export const dashboardSlice = adotApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTotalCounts: builder.query<{ data: CountStatistics }, void>({
      query: () => ({
        url: "/v1/admin/data/count",
        method: "GET",
      }),
    }),
    getAllTotalDoctorCounts: builder.query<{ data: CountStatistics }, void>({
      query: () => ({
        url: "/v2/admin/doctors/count",
        method: "GET",
      }),
    }),
     getAllTotalPaitientsConnected: builder.query<{ data: CountStatistics }, void>({
      query: () => ({
        url: "/v2/admin/get-connected-patients",
        method: "GET",
      }),
    }),
      getAllTotalActiveDoctors: builder.query<{ data: CountStatistics }, void>({
      query: () => ({
        url: "/v2/admin/total-active-doctors",
        method: "GET",
      }),
    }),
    getDailyActiveUsers: builder.query<
      { data: ActiveUsersData },
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/v1/admin/graph/users/active?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),
    getDailyRegisteredUsers: builder.query<
      { data: RegisteredUsersData },
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/v1/admin/graph/users/registered?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),
    getDailyRegisteredDoctors: builder.query<
      { data: RegisteredUsersData },
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/v2/admin/graph/doctors/registered?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
        method: "GET",
      }),
    }),
      getTimeBoundActiveRegisteredDoctors: builder.query<
      { data: any},
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/v2/admin/graph/time-bound-active-doctors?timeBound=Custom&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
        method: "GET",
      }),
    }),
     getDailyActiveRegisteredDoctors: builder.query<
      { data: any},
      { startDate: string }
    >({
      query: ({ startDate }) => ({
        url: `/v2/admin/graph/active-doctors?date=${encodeURIComponent(startDate)}`,
        method: "GET",
      }),
    }),
    getDailyRegisteredInsights: builder.query<
      { data: InsightsAddedStats },
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/v1/admin/graph/insight?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),
    getUsersChildren: builder.query<{ data: object }, void>({
      query: () => ({
        url: "/v1/admin/graph/children",
        method: "GET",
      }),
    }),
    getUsersAgeDistribution: builder.query<{ data: object }, void>({
      query: () => ({
        url: "/v1/admin/graph/age",
      }),
    }),
    getDailyRegisteredTopic: builder.query<
      { data: TopicsAddedStats },
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/v1/admin/graph/topic?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),
    getDailyRegisteredCategory: builder.query<
      { data: CategoriesAddedStats },
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/v1/admin/graph/category?startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
    }),
    getPopularCategories: builder.query<{ data: any }, any>({
      query: ({page, limit, sortBy, sortOrder, isArchived, startDate, endDate, searchQuery}) => {
        return {
          url: `/v1/admin/categories/popular?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isArchived=${isArchived}&searchQuery=${searchQuery}&startDate=${startDate}&endDate=${endDate}`,
          method: "GET",
        }
      },
    }),
    getPopularTopics: builder.query<{ data: any }, any>({
      query: ({page, limit, sortBy, sortOrder, isArchived, startDate, endDate, searchQuery}) => {
        return {
          url: `/v1/admin/topics/popular?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isArchived=${isArchived}&searchQuery=${searchQuery}&startDate=${startDate}&endDate=${endDate}`,
          method: "GET",
        }
      },
    }),
    getPopularInsights: builder.query<{ data: any }, any>({
      query: ({page, limit, sortBy, sortOrder, isArchived, startDate, endDate, searchQuery}) => {
        return {
          url: `/v1/admin/insights/popular?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isArchived=${isArchived}&searchQuery=${searchQuery}&isArchived=${isArchived}&startDate=${startDate}&endDate=${endDate}`,
          method: "GET",
        }
      },
    }),
    getPopularFeatures:builder.query<{data:Feature[]},{startDate:string,endDate:string}>(
      {
        query:({startDate,endDate})=>({
          url:`/v1/admin/popular/features?startDate=${startDate}&endDate=${endDate}`,
          method:"GET"
        })
      }
    ),
       getPopularFeaturesDoctor:builder.query<{data:Feature[]},{startDate:string,endDate:string}>(
      {
        query:({startDate,endDate})=>({
          url:`/v2/admin/doctor/popular/features?startDate=${startDate}&endDate=${endDate}`,
          method:"GET"
        })
      }
    ),
   
   
  }),
});

export const {
  useGetAllTotalCountsQuery,
  useGetDailyActiveUsersQuery,
  useGetDailyRegisteredUsersQuery,
  useGetDailyRegisteredInsightsQuery,
  useGetDailyRegisteredTopicQuery,
  useGetDailyRegisteredCategoryQuery,
  useGetUsersAgeDistributionQuery,
  useGetUsersChildrenQuery,
  useGetPopularFeaturesQuery,
  useGetPopularFeaturesDoctorQuery,
  useGetPopularCategoriesQuery,
  useGetPopularInsightsQuery,
  useGetPopularTopicsQuery, 
  useGetDailyRegisteredDoctorsQuery,
  useGetAllTotalDoctorCountsQuery, 
  useGetAllTotalPaitientsConnectedQuery, 
  useGetDailyActiveRegisteredDoctorsQuery, 
  useGetTimeBoundActiveRegisteredDoctorsQuery, 
  useGetAllTotalActiveDoctorsQuery
} = dashboardSlice;
