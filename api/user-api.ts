import { MobileUser, User } from '@/types/user';
import adotApi from ".";


export const userSlice = adotApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<{data: User[]}, any>({
      query: ({role, status, sortBy, sortOrder, pageNumber, limit, keyword}) => {
        return {
          url: `/v1/admin/users-filtered-sorted?role=${role}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}&pageNumber=${pageNumber}&limit=${limit}&keyword=${keyword}`,
          method: "GET",
        }
      },
    providesTags: ['Users'],
    }),
    
    getAllMobileUsers: builder.query<{data: {users: MobileUser[], count: number}}, any>({
      query: ({pageNumber, limit, sortBy, sortOrder, status, keyword}) => {
        return {
          url: `/v1/admin/get-all-active-users?pageNumber=${pageNumber}&limit=${limit}&keyword=${keyword}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
          method: "GET",
        };
      },
    providesTags: ['Users'],
    }),

    addUser: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => {
        return {
          url: '/v1/admin/signup',
          method: 'POST',
          body: data,
          formData: true
        };
      },
      invalidatesTags: ['Users'],
    }),

    updateRole: builder.mutation<any, { data: { newRole: string, _id: string }}>({
      query: ({ data }) => {
        return {
          url: `/v1/admin/update-role/`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['Users'],
    }),

    updatePassword: builder.mutation<any, { data: { oldPassword: string, newPassword: string }}>({
      query: ({ data }) => {
        return {
          url: `/v1/admin/update-password`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['Users'],
    }),

    registerUser: builder.mutation<any, { dataToSend: Pick<User, 'firstName' | 'lastName' | 'email' | 'role' | 'hospitalId'> }>({
      query: ({ dataToSend }) => {
        return {
          url: '/v1/admin/signup',
          method: 'POST',
          body: dataToSend,
        };
      },
      invalidatesTags: ['Users'],
    }),

    archiveUser: builder.mutation<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/archive/user/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Users'],
    }),

    getProfile: builder.query<{data: {user: User}}, void>({
      query: () => {
        return {
          url: `/v1/admin/profile`,
          method: "GET",
        }
      },
    providesTags: ['Users'],
    }),

    getFeedbacks: builder.query<{data: any}, void>({
      query: () => {
        return {
          url: `/v1/admin/feedbacks`,
          method: "GET",
        }
      },
    providesTags: ['Users'],
    }),

    updateProfile: builder.mutation<any, { data: any}>({
      query: ({ data }) => {
        return {
          url: `/v1/admin/profile/update`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['Users'],
    }),

    searchDashboardUsers: builder.query<{data: User[]}, any>({
      query: ({userQuery}) => {
        return {
          url: `/v1/admin/dashboard/users/search?query=${userQuery}`,
          method: "GET",
        }
      },
      providesTags: ['Users'],
    }),
    
    searchMobileUsers: builder.query<{data: MobileUser[]}, any>({
      query: ({userQuery}) => {
        return {
          url: `/v1/admin/mobile/users/search?query=${userQuery}`,
          method: "GET",
        };
      },
    providesTags: ['Users'],
    }),
  }),
});

export const { useGetAllUsersQuery, useGetFeedbacksQuery, useAddUserMutation, useUpdateRoleMutation, useRegisterUserMutation, useArchiveUserMutation, useGetProfileQuery, useUpdateProfileMutation, useGetAllMobileUsersQuery, useSearchMobileUsersQuery, useSearchDashboardUsersQuery, useUpdatePasswordMutation} = userSlice;