import { getAllFactsResponse } from "@/types/didYouKnow";
import adotApi from ".";

export const didYouKnowSlice = adotApi.injectEndpoints({

  endpoints: (builder) => ({
   
   addFact: builder.mutation<void, { data: any }>({
    query: ({ data }) => {
        return {
            url: "v1/admin/funFact/create",
            method: "POST",
            body: data,
            headers: { "Content-Type": "application/json" },
        };
    },
    invalidatesTags: ["Insights", "Topics"],
}),
 updateFact: builder.mutation<any, { data: any, id: string }>({
    query: ({ data, id }) => {
        return {
            url: `v1/admin/funFact/${id}`,  // Include the id in the URL
            method: "PUT",
            body: data,
            headers: { "Content-Type": "application/json" },
        };
    },
    invalidatesTags: ["Insights", "Topics"],
}),
    
     getAllFacts: builder.query<getAllFactsResponse , any>({
      query: () => ({
        url:"/v1/admin/funFacts",
        method: "GET",
      }),
    }),
  
  
  }),
});

export const { useGetAllFactsQuery, useAddFactMutation, useUpdateFactMutation } = didYouKnowSlice;
