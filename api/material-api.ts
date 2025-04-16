import adotApi from ".";
import { Material, MaterialContainer } from "@/types/material";

export const materialSlice = adotApi.injectEndpoints({
  endpoints: (builder) => ({
    getMaterial: builder.query<MaterialContainer, void>({
      query: () => ({
        url: "/v2/admin/ref",
        method: "GET",
      }),
      providesTags: ["Materials"],
    }),

    // Expect a FormData
    postMaterial: builder.mutation<any, { data: FormData }>({
      query: ({ data }) => ({
        url: "/v2/admin/ref/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Materials"],
    }),

    archiveMaterial: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/v2/admin/ref/archive${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Materials"],
    }),
    unarchiveMaterial: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/v2/admin/ref/unarchive${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Materials"],
    }),

    deleteMaterial: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/v2/admin/ref${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Materials"],
    }),

    editMaterial: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/v2/admin/ref/update${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Materials"],
    }),
  }),
});

export const {
  useGetMaterialQuery,
  usePostMaterialMutation,
  useArchiveMaterialMutation,
  useUnarchiveMaterialMutation,
  useDeleteMaterialMutation,
  useEditMaterialMutation,
} = materialSlice;
