import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { config } from "@/utils/config";

const addTokenToRequest = async (headers: any, {}: any) => {
  const session: any = await getSession();
  if (session) {
    const token = session.tokens.accessToken;
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const adotApi = createApi({
  reducerPath: "adotApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: config.apiUrl,

    baseUrl: `${process.env.NEXT_PUBLIC_PROD_API_URL ?? 'https://adot-prod-174348059214.europe-west2.run.app/api'} `,
    
    
    prepareHeaders: (headers, { getState }: any) => {
      return addTokenToRequest(headers, { getState });
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["Categories", "Insights", "Quizzes", "Topics", "Users","Doctors", 'Appointments','Materials'],
});



export default adotApi;
