import { CategoriesContainer, Category, PopularCategory, ApproveCategoryResponse} from "@/types/category";
import adotApi from ".";


export const categorySlice = adotApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<CategoriesContainer, void>({
      query: () => ({
        url: "/v1/admin/categories",
        method: "GET",
      }),
      providesTags: ['Categories'],
    }),
    getCategoryById: builder.query<{ data: Category}, string>({
      query: (id) => {
        return {
          url: `/v1/admin/categories/${id}`,
          method: "GET",
        }
      },
      providesTags: ['Categories'],
    }),
    getSortedCategories: builder.query<{ data: {categories: Category[], count: number} }, any>({
      query: ({page, limit, sortBy, sortOrder, isArchived, keyword}) => {
        return {
          url: `/v1/admin/sorted-categories?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isArchived=${isArchived}&keyword=${keyword}`,
          method: "GET",
        }
        
      },
    }),
    addCategory: builder.mutation<any, { data: any }>({
      query: ({ data }) => {
        return {
          url: '/v1/admin/categories/create',
          method: 'POST',
          body: data        };
      },
      invalidatesTags: ['Categories'],
    }),
    editCategory: builder.mutation<any, { data: any, id:string }>({
      query: ({ data, id }) => {
        return {
          url: `/v1/admin/categories/${id}`,
          method: 'PUT',
          body: data,
          formData: true
        };
      },
      invalidatesTags: ['Categories'],
    }),
    archiveCategory: builder.mutation<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/archiveCategory/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Categories'],
    }),
    unarchiveCategory: builder.mutation<any, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/unarchiveCategory/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Categories'],
    }),
    searchCategory: builder.query<{ data: Category[] }, any>({
      query: ({userQuery}) => {
        return {
          url: `/v1/admin/categories/search?query=${userQuery}`,
          method: "GET",
        } 
      },
    }),
    popularCategory:builder.query<{ data: {PopularCategory: PopularCategory} }, any>({
      query: ({page, limit, sortBy, sortOrder, isArchived, keyword, startDate, endtDate }) => {
        return {
          url: `/v1/admin/sorted-categories?pageNumber=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&isArchived=${isArchived}&startDate=${startDate}&endtDate=${endtDate}`,
          method: "GET",
        }
        
      },
    }),
     approveCategory: builder.mutation<ApproveCategoryResponse, { id: string }>({
      query: ({ id }) => {
        return {
          url: `/v1/admin/category/approve/${id}`,
          method: 'PUT',
        };
      },
      invalidatesTags: ['Categories'],
    }),

  }),
});

export const { useGetAllCategoriesQuery, useGetCategoryByIdQuery, useGetSortedCategoriesQuery, useAddCategoryMutation, useEditCategoryMutation , useArchiveCategoryMutation, useUnarchiveCategoryMutation, useSearchCategoryQuery, usePopularCategoryQuery, useApproveCategoryMutation} = categorySlice;
