import { getSession } from "next-auth/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Doctor } from "@/types/doctor";
import adotApi from ".";
import { AddPatientData } from "@/types/patient";
import { GetAllPatientResponse } from "@/types/hospital-admin";
const addTokenToRequest = async (headers: any, {}: any) => {
  const session: any = await getSession();
  if (session) {
    const token = session.tokens.accessToken;
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const doctorSlice = adotApi.injectEndpoints({
  endpoints: (builder) => ({
    registerDoctor: builder.mutation<any, { dataToSend: any }>({
      query: ({ dataToSend }) => {
        return {
          url: "/v2/doctor/signup",
          method: "POST",
          body: dataToSend,
        };
      },
      invalidatesTags: ["Doctors"],
    }),

    addDoctorForHospital: builder.mutation<any, { dataToSend: any }>({
      query: ({ dataToSend }) => {
        return {
          url: "/v1/admin/doctor",
          method: "POST",
          body: dataToSend,
        };
      },
      invalidatesTags: ["Doctors"],
    }),

    disconnectPaitentsFromDoctor: builder.mutation<any, { dataToSend: any }>({
      query: ({ dataToSend }) => {
        return {
          url: "/v2/admin/update-connection",
          method: "PUT",
          body: dataToSend,
        };
      },
      invalidatesTags: ["Doctors"],
    }),

    getSortedDoctors: builder.query<
      { data: { users: Doctor[]; count: number } },
      any
    >({
      query: ({ page, limit, sortBy, sortOrder, keyword, status }) => {
        return {
          url: `/v2/admin/doctor/get-all?status=${status}&pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&keyword=${keyword}`,
          method: "GET",
        };
      },
      providesTags: ["Doctors"],
    }),

    getPatientsForDoctor: builder.query<
      any,
      {
        page: number;
        doctorId: string;
        limit: number;
        sortBy?: string;
        sortOrder?: string;
        status?:string
      }
    >({
      query: ({
        page,
        doctorId,
        limit,
        sortBy = "dueDate",
        sortOrder = "asc",
        status = "Pending"
      }) => ({
        url: `/v2/admin/get-doctor-patients/${doctorId}?limit=${limit}&pageNumber=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}`,
        method: "GET",
      }),
    }),

    addPatientForDoctor: builder.mutation<
      any,
      { patientData: AddPatientData; doctorId: string }
    >({
      query: ({ patientData, doctorId }) => ({
        url: `/v2/doctor/add/user?doctorId=${doctorId}`,
        method: "POST",
        body: patientData,
      }),
    }),

    disConnectPatientForDoctor: builder.mutation<
      any,
      { patientId: any; doctorId: string }
    >({
      query: ({ patientId, doctorId }) => ({
        url: "/v2/admin/update-connection",
        method: "PUT",
        body: { patientId: patientId, doctorId: doctorId },
      }),
    }),

    // api/v2/admin/update-connection

    searchUserFromAdot: builder.query<
      any,
      { name?: string; email?: string; phoneNumber?: string }
    >({
      query: ({ name, email, phoneNumber }) => {
        // Construct query parameters dynamically
        const params = new URLSearchParams();
        if (name) params.append("searchByName", name);
        if (email) params.append("email", email);

        return {
          url: `/v2/admin/search/user?${params.toString()}`,
          method: "POST",
          body: phoneNumber ? { phoneNumber: phoneNumber } : {},
        };
      },
    }),

    connectToDoctor: builder.mutation<
      any,
      { doctorId: string; patientId: string }
    >({
      query: ({ doctorId, patientId }) => {
        return {
          url: `/v2/doctor/addDoctorPatient?doctorId=${doctorId}`, // Update the URL based on your API endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure JSON data is properly sent
          },
          body: { patient: patientId }, // Encapsulate patientId in an object
        };
      },
    }),
    getAllPatientsForDoctor: builder.query<
      GetAllPatientResponse,
      { doctorId: string }
    >({
      query: ({ doctorId }) => ({
        url: `/v2/admin/get-doctor-patient/${doctorId}`,
        method: "GET",
      }),
    }),
    getHospitalsDoctor: builder.query<
      any,
      { hospitalAdmin: string; pageNumber: number; limit: number }
    >({
      query: ({ hospitalAdmin, pageNumber, limit }) => ({
        url: `/v2/admin/doctor/get-doctors/${hospitalAdmin}?pageNumber=${pageNumber}&limit=${limit}`,
        method: "GET",
      }),
    }),

    getHospitals: builder.query<any, void>({
      query: () => ({
        url: `/v2/hospital`,
        method: "GET",
      }),
    }),

    getDailyRegisteredDoctors4Time: builder.query<any, { date: string }>({
      query: ({ date }) => ({
        url: `/v2/admin/graph/added-doctors?date=${date}`,
        method: "GET",
      }),
    }),

    deleteDoctor: builder.mutation<any, { doctorId: string }>({
      query: ({ doctorId }) => ({
        url: `/v2/admin/doctor/delete/${doctorId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useConnectToDoctorMutation,
  useGetHospitalsQuery,
  useAddPatientForDoctorMutation,
  useRegisterDoctorMutation,
  useGetSortedDoctorsQuery,
  useGetPatientsForDoctorQuery,
  useSearchUserFromAdotQuery,
  useGetAllPatientsForDoctorQuery,
  useGetHospitalsDoctorQuery,
  useAddDoctorForHospitalMutation,
  useDeleteDoctorMutation,
  useDisConnectPatientForDoctorMutation,
  useGetDailyRegisteredDoctors4TimeQuery,
} = doctorSlice;
