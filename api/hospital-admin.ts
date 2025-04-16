import adotApi from ".";
import { AppointmentsResponse, FormattedAppointment } from "@/types/hospital-admin";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const addTokenToRequest = async (headers: any, {}: any) => {
  const session: any = await getSession();
  if (session) {
    const token = session.tokens.accessToken;
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const hospitalAdminSlice = adotApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAppointment: builder.query<AppointmentsResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/v2/appointments/all?doctorId=${id}`,
        method: "GET",
      }),
      providesTags: ['Appointments'], 
    }),
    addAppointment: builder.mutation<any, { dataToSend: FormattedAppointment; doctorId: string }>({
      query: ({ dataToSend, doctorId }) => ({
        url: `/v2/appointment/create/?doctorId=${doctorId}`,
        method: 'POST',
        body: dataToSend,
      }),
      invalidatesTags: ['Appointments'], // This will invalidate the cache for `getAllAppointment`
    }),

    deleteAppointment: builder.mutation<any, {id: string, appointmentId: string }>({
      query: ({id, appointmentId}) => ({
        url: `/v2/appointment/${appointmentId}?doctorId=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Appointments'],
    }),

    editAppointment: builder.mutation<any,{ dataToSend: FormattedAppointment, doctorId: string }>({
      query: ({ dataToSend,doctorId }) => ({
        url: `/v2/appointment/${dataToSend._id}?doctorId=${doctorId}`, 
        method: 'PUT',
        body: dataToSend,
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
});

export const { useGetAllAppointmentQuery, useAddAppointmentMutation, useDeleteAppointmentMutation, useEditAppointmentMutation} = hospitalAdminSlice;
